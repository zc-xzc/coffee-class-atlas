"""Validate the reviewed public release offline with the Python standard library."""
import argparse
import hashlib
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
APP = {"index.html", "style.css", "atlas.js", "film.js", "course-data.js", "README.md",
       ".nojekyll", "public-media.json", "check_release.py"}
TOUR_HASHES = {
    "tour/captions.js": "e777256f413a80a5a66452b1866960b0fc4bc25e860d91987a345fc865edc644",
    "tour/chapters.js": "ee42638361d35d37e084ea75727fc56cf20bd0141f8891e23de01a1723fed1c1",
    "tour/poster.jpg": "6b5a496fd874d5bdfca5bbd3ab9ab68fb58ffba8f53b8944dfdba45d46d771f8",
    "tour/promo-en.mp4": "cc1f5ce29ca982792f7c9e2c1ca19da75a33f161d8ffa0be3cff1350c1ea5e45",
    "tour/promo.mp4": "34a058fb98196b9766e128bc547f8afa26d61910b1b11c1fd98aa86be7573e6b"
}
PICTURES = {".jpg", ".jpeg", ".png", ".webp"}

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=ROOT)
    root = parser.parse_args().root.resolve()
    manifest = json.loads((root / "public-media.json").read_text(encoding="utf-8"))
    expected = set(APP)
    errors = []
    for name, digest in TOUR_HASHES.items():
        path = root / name
        expected.add(name)
        if path.is_symlink() or not path.is_file():
            errors.append("Missing tour component or prohibited symlink: " + name)
        elif hashlib.sha256(path.read_bytes()).hexdigest() != digest:
            errors.append("Tour component differs from its reviewed copy: " + name)
    for entry in manifest:
        name = entry["path"]
        path = root / name
        if not name.startswith("public-assets/") or len(Path(name).parts) != 2 or path.suffix.lower() not in PICTURES:
            errors.append("Unexpected public media path: " + name)
            continue
        if name in expected:
            errors.append("Duplicate public media path: " + name)
        expected.add(name)
        if not path.is_file() or path.is_symlink():
            errors.append("Missing asset or prohibited symlink: " + name)
            continue
        if hashlib.sha256(path.read_bytes()).hexdigest() != entry["sha256"]:
            errors.append("Asset differs from its reviewed copy: " + name)
        if entry["kind"] not in {"student-photo", "reference"}:
            errors.append("Missing public category: " + name)
        if entry["kind"] == "reference" and not all(entry.get(k) for k in ["source", "attribution", "license"]):
            errors.append("Missing attribution information: " + name)
    files = [p for p in root.rglob("*") if ".git" not in p.relative_to(root).parts]
    actual = {p.relative_to(root).as_posix() for p in files if p.is_file() or p.is_symlink()}
    errors.extend("Unexpected file: " + p for p in sorted(actual - expected))
    errors.extend("Missing file: " + p for p in sorted(expected - actual))
    errors.extend("Prohibited symlink: " + str(p.relative_to(root)) for p in files if p.is_symlink())
    if errors:
        print("\n".join(errors), file=sys.stderr)
        return 1
    print(f"PASS · {len(manifest)} reviewed stills · one bilingual course film · {len(actual)} files · no additional media or archives")
    return 0
if __name__ == "__main__":
    sys.exit(main())
