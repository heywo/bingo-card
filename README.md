# bingo-card

This is a simple bingo card application that runs in the browser with no external dependencies. It can be hosted in any manner you see fit. This started as an fun project for my coworkers and I to hang out and play bingo while working remotely due to the COVID-19 pandemic.

This board supports displaying images in the background of the number when that number is selected.

## Configuration
1. The system expects to find 112px by 112px images in an /images/ folder in the root directory. Naming scheme: image_#.png. The variable IMAGECOUNT should be set to the number of images you have (if you have 24 images, then it should be set to 24). The system will ensure duplicates do not appear unless there are less images then available spots (< 24 images).
2. If you don't want the marquee to be active, you can set MARQUEE_ENABLED = false in bingo.js.
3. If you don't want the mouse trail to be active, you can set MOUSETRAIL_ENABLED = false in bingo.js
4. The mouse trail expects an image "head_1.png" - it will support multiple random images in a future release
5. The "free" item uses a different image background - the system expects a image file named "free_spot.png".
