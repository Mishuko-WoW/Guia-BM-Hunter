"""
Sincronizador de talent strings de Beast Mastery Hunter desde Icy Veins.

Importante:
- Icy Veins no expone en el HTML estatico los strings reales de "Export Talents".
- Los strings correctos (formato C0P...) se generan del lado cliente en el
  calculator renderizado por JavaScript.
- Por eso este script usa:
  1) requests + BeautifulSoup4 para validar la pagina y dejar un registro basico
  2) Playwright para abrir la pagina, pulsar "Export Talents" y leer el string exacto

Requisitos:
- requests
- beautifulsoup4
- playwright

Preparacion inicial (una sola vez):
    python -m pip install requests beautifulsoup4 playwright
    python -m playwright install chromium

Uso:
    python scripts/extract_talent_strings.py
"""

from __future__ import annotations

import json
import re
import tempfile
from collections import OrderedDict
from pathlib import Path

import requests
from bs4 import BeautifulSoup
from playwright.sync_api import TimeoutError as PlaywrightTimeoutError
from playwright.sync_api import sync_playwright

# ------------------------------------------------------------
# Configuracion facil de ajustar
# ------------------------------------------------------------
URL = "https://www.icy-veins.com/wow/beast-mastery-hunter-pve-dps-spec-builds-talents"
OUTPUT_FILE = Path("talent_strings.json")
TIMEOUT_SECONDS = 30
PLAYWRIGHT_TIMEOUT_MS = 15000

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    )
}

# IDs observados en Icy Veins para las builds que nos interesan.
# Si Icy Veins reordena los bloques, esta tabla sera lo primero a revisar.
BUILD_SPECS = OrderedDict(
    {
        "Pack Leader — Single Target / Raid": {
            "builder_id": 1,
            "file": Path("src/content/builds/pl-raid.md"),
            "hero_path": "pack-leader",
        },
        "Dark Ranger — Raid AoE": {
            "builder_id": 2,
            "file": Path("src/content/builds/dr-raid.md"),
            "hero_path": "dark-ranger",
        },
        "Dark Ranger — M+ (Prio & AoE)": {
            "builder_id": 3,
            "file": Path("src/content/builds/dr-mp.md"),
            "hero_path": "dark-ranger",
        },
        "Pack Leader — M+": {
            "builder_id": 6,
            "file": Path("src/content/builds/pl-mp.md"),
            "hero_path": "pack-leader",
        },
    }
)

C0P_RE = re.compile(r"\bC0P[A-Za-z0-9+/_=-]{20,}\b")


def safe_write_json(data: OrderedDict[str, str], output_file: Path) -> None:
    """Escritura segura: primero temporal y luego reemplazo atomico."""
    output_file = output_file.resolve()
    output_file.parent.mkdir(parents=True, exist_ok=True)

    with tempfile.NamedTemporaryFile(
        mode="w", encoding="utf-8", delete=False, dir=output_file.parent, suffix=".tmp"
    ) as tmp:
        json.dump(data, tmp, ensure_ascii=False, indent=2)
        tmp.write("\n")
        temp_name = tmp.name

    Path(temp_name).replace(output_file)


def extract_frontmatter_value(file_path: Path, key: str) -> str | None:
    """Extrae un valor simple del frontmatter YAML."""
    try:
        text = file_path.read_text(encoding="utf-8")
    except OSError:
        return None

    m = re.search(rf'^{re.escape(key)}:\s*"([^"]+)"\s*$', text, flags=re.MULTILINE)
    return m.group(1) if m else None


def update_frontmatter_value(file_path: Path, key: str, new_value: str) -> bool:
    """Actualiza una clave simple del frontmatter YAML."""
    text = file_path.read_text(encoding="utf-8")
    pattern = rf'^{re.escape(key)}:\s*"([^"]+)"\s*$'
    old = re.search(pattern, text, flags=re.MULTILINE)
    if not old:
        raise ValueError(f"No se encontró {key} en {file_path}")

    current = old.group(1)
    if current == new_value:
        return False

    new_text = re.sub(
        pattern,
        f'{key}: "{new_value}"',
        text,
        flags=re.MULTILINE,
        count=1,
    )
    file_path.write_text(new_text, encoding="utf-8")
    return True


def build_wowhead_url(hero_path: str, talent_string: str) -> str:
    """Construye wowheadUrl consistente con el string exportado."""
    return f"https://www.wowhead.com/talent-calc/hunter/beast-mastery/{hero_path}#{talent_string}"


def fetch_static_page() -> BeautifulSoup:
    """Descarga la pagina para comprobaciones basicas con requests + BeautifulSoup4."""
    response = requests.get(URL, headers=HEADERS, timeout=TIMEOUT_SECONDS)
    response.raise_for_status()
    return BeautifulSoup(response.text, "html.parser")


def dismiss_overlays(page) -> None:
    """Cierra banners de consentimiento y otros overlays conocidos si aparecen."""
    selectors = [
        "button.fc-cta-consent",
        "button[aria-label='Consent']",
        "button[title='Consent']",
        "button:has-text('Consent')",
        "button:has-text('Accept')",
        "button:has-text('Agree')",
        "button:has-text('I Agree')",
    ]

    for selector in selectors:
        locator = page.locator(selector).first
        try:
            if locator.count() and locator.is_visible(timeout=1000):
                locator.click(timeout=2000, force=True)
                page.wait_for_timeout(400)
                break
        except Exception:
            continue

    # Si el overlay sigue montado, lo retiramos para no bloquear la interaccion.
    page.evaluate(
        """
        () => {
          for (const selector of ['.fc-dialog-overlay', '.fc-consent-root']) {
            for (const node of document.querySelectorAll(selector)) {
              node.remove();
            }
          }
        }
        """
    )


def click_export_button(page, builder_id: int) -> None:
    """Dispara el click del boton Export Talents desde el DOM del builder."""
    selector = f"#midnight-skill-builder-{builder_id} div.button-container.export-talents"
    page.evaluate(
        """
        (buttonSelector) => {
          const button = document.querySelector(buttonSelector)
          if (!button) {
            throw new Error(`No se encontro el boton export: ${buttonSelector}`)
          }
          button.click()
        }
        """,
        selector,
    )


def read_copied_export_string(page) -> str:
    """Espera a que el portapapeles contenga un string C0P valido."""
    for _ in range(10):
        copied = page.evaluate("navigator.clipboard.readText()")
        copied = copied.strip()
        if C0P_RE.fullmatch(copied):
            return copied
        page.wait_for_timeout(200)

    return page.evaluate("navigator.clipboard.readText()").strip()


def extract_export_strings_with_playwright() -> OrderedDict[str, str]:
    """
    Abre Icy Veins, pulsa los botones Export Talents y captura los C0P reales.

    Usamos el portapapeles del navegador porque el boton de Icy Veins copia el
    string exacto que queremos sincronizar.
    """
    results: OrderedDict[str, str] = OrderedDict()

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            user_agent=HEADERS["User-Agent"],
            permissions=["clipboard-read", "clipboard-write"],
        )
        page = context.new_page()
        page.goto(URL, wait_until="networkidle", timeout=PLAYWRIGHT_TIMEOUT_MS)
        dismiss_overlays(page)

        for build_name, cfg in BUILD_SPECS.items():
            builder_id = cfg["builder_id"]
            container = page.locator(f"#midnight-skill-builder-{builder_id}")
            container.wait_for(state="attached", timeout=PLAYWRIGHT_TIMEOUT_MS)
            dismiss_overlays(page)

            if container.locator("div.button-container.export-talents").count() == 0:
                raise RuntimeError(
                    f"No se encontró el boton Export Talents para {build_name} "
                    f"(builder {builder_id})."
                )

            page.evaluate("navigator.clipboard.writeText('')")
            click_export_button(page, builder_id)
            copied = read_copied_export_string(page)

            if not C0P_RE.fullmatch(copied):
                raise RuntimeError(
                    f"El string copiado para {build_name} no tiene formato C0P valido: {copied!r}"
                )

            results[build_name] = copied

        context.close()
        browser.close()

    return results


def sync_local_builds(export_strings: OrderedDict[str, str]) -> tuple[list[str], list[str]]:
    """Actualiza copyString y wowheadUrl en las builds locales."""
    changed_copy: list[str] = []
    changed_wowhead: list[str] = []

    for build_name, cfg in BUILD_SPECS.items():
        file_path = cfg["file"].resolve()
        hero_path = cfg["hero_path"]
        talent_string = export_strings[build_name]
        wowhead_url = build_wowhead_url(hero_path, talent_string)

        if not file_path.exists():
            raise FileNotFoundError(f"No existe el archivo esperado: {file_path}")

        if extract_frontmatter_value(file_path, "copyString") is None:
            raise ValueError(f"No se encontró copyString en {file_path}")
        if extract_frontmatter_value(file_path, "wowheadUrl") is None:
            raise ValueError(f"No se encontró wowheadUrl en {file_path}")

        if update_frontmatter_value(file_path, "copyString", talent_string):
            changed_copy.append(str(file_path))
        if update_frontmatter_value(file_path, "wowheadUrl", wowhead_url):
            changed_wowhead.append(str(file_path))

    return changed_copy, changed_wowhead


def main() -> int:
    try:
        # Mantenemos requests + BeautifulSoup4 porque sirven para validar acceso basico
        # y facilitan futuros ajustes si Icy Veins cambia la estructura del HTML.
        soup = fetch_static_page()
        if not soup.find(id="midnight-skill-builder-1"):
            print("ERROR: la pagina no contiene el primer builder esperado.")
            print("No se ha modificado talent_strings.json ni las builds locales.")
            return 1
    except requests.RequestException as exc:
        print(f"ERROR: no se pudo descargar la pagina. Detalle: {exc}")
        print("No se ha modificado talent_strings.json ni las builds locales.")
        return 1

    try:
        export_strings = extract_export_strings_with_playwright()
    except PlaywrightTimeoutError as exc:
        print(f"ERROR: timeout al renderizar o interactuar con Icy Veins. Detalle: {exc}")
        print("No se ha modificado talent_strings.json ni las builds locales.")
        return 1
    except Exception as exc:
        print(f"ERROR: no se pudieron extraer los Export Talents reales. Detalle: {exc}")
        print("No se ha modificado talent_strings.json ni las builds locales.")
        return 1

    try:
        safe_write_json(export_strings, OUTPUT_FILE)
    except OSError as exc:
        print(f"ERROR: no se pudo escribir talent_strings.json. Detalle: {exc}")
        print("No se han modificado las builds locales.")
        return 1

    try:
        changed_copy, changed_wowhead = sync_local_builds(export_strings)
    except Exception as exc:
        print(f"ERROR: no se pudieron sincronizar las builds locales. Detalle: {exc}")
        print("talent_strings.json sí se generó, pero los archivos locales no se actualizaron por completo.")
        return 1

    print(f"OK: se guardaron {len(export_strings)} builds en {OUTPUT_FILE}.")
    for build_name, talent_string in export_strings.items():
        print(f" - {build_name}: {talent_string}")

    if changed_copy:
        print("\nCambios aplicados en copyString:")
        for path in changed_copy:
            print(f" - {path}")
    else:
        print("\nNo hubo cambios en copyString.")

    if changed_wowhead:
        print("\nCambios aplicados en wowheadUrl:")
        for path in changed_wowhead:
            print(f" - {path}")
    else:
        print("\nNo hubo cambios en wowheadUrl.")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())


# ------------------------------------------------------------------
# Notas de ajuste manual
# ------------------------------------------------------------------
# 1) BUILD_SPECS:
#    Si Icy Veins reordena los midnight-skill-builder-<id>, ajusta builder_id.
#
# 2) Selectores del boton:
#    Si cambia la clase del boton export, revisa la linea con:
#    "div.button-container.export-talents".
#
# 3) Formato del string:
#    Ahora validamos formato C0P..., porque es el que devuelve Export Talents.
#    Si Blizzard cambia ese formato, ajusta C0P_RE.
#
# 4) wowheadUrl:
#    Se genera con #<copyString>. Si prefieres otro formato de URL, ajusta
#    build_wowhead_url().
#
# 5) Dependencia de navegador:
#    Este script necesita Playwright + Chromium instalado para capturar el
#    export real del boton. Con requests + BeautifulSoup4 solo no basta,
#    porque Icy Veins no expone esos C0P en el HTML estatico.
