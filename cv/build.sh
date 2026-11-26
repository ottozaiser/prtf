#!/bin/zsh
# Re-export the one-page CV from cv/cv.html (needs Google Chrome).
#   ./cv/build.sh          public PDF, no phone  -> public/cv/Otto-Zaiser-CV.pdf
#   ./cv/build.sh email    private PDF + phone   -> ~/Documents/otto-cv/Otto-Zaiser-CV-email.pdf
# The phone number is read from ~/Documents/otto-cv/phone.txt (or $CV_PHONE) and never stored in this repo.
cd "${0:A:h}" || exit 1
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
PRIVATE_DIR="$HOME/Documents/otto-cv"

render() { "$CHROME" --headless=new --disable-gpu --no-pdf-header-footer --virtual-time-budget=5000 \
  --print-to-pdf="$1" "$2" 2>/dev/null && echo "Wrote $1"; }

if [[ $1 == email ]]; then
  phone=${CV_PHONE:-$(cat "$PRIVATE_DIR/phone.txt" 2>/dev/null)}
  [[ -z $phone ]] && { print -u2 "No phone: put it in $PRIVATE_DIR/phone.txt or set CV_PHONE"; exit 1; }
  mkdir -p "$PRIVATE_DIR"
  render "$PRIVATE_DIR/Otto-Zaiser-CV-email.pdf" "file://$PWD/cv.html?phone=${phone// /%20}"
else
  render ../public/cv/Otto-Zaiser-CV.pdf "file://$PWD/cv.html"
fi
