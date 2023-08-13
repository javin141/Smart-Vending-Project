from picamera2 import Picamera2, Preview, MappedArray
import cv2
from pyzbar.pyzbar import decode
import time

picam2 = Picamera2()



def capture_to(file_path: str):

    picam2.start()
    time.sleep(1)

    metadata = picam2.capture_file(file_path)
    print(metadata)

    picam2.close()


def read_barcode_loop_sync() -> str:
    colour = (0, 255, 0)
    font = cv2.FONT_HERSHEY_SIMPLEX
    scale = 1
    thickness = 2
    preview_config = picam2.create_preview_configuration(main={"size": (800, 600)})
    picam2.configure(preview_config)

    def draw_barcodes(request):
        with MappedArray(request, "main") as m:
            for b in barcodes:
                if b.polygon:
                    x = min([p.x for p in b.polygon])
                    y = min([p.y for p in b.polygon]) - 30
                    cv2.putText(m.array, b.data.decode('utf-8'), (x, y), font, scale, colour, thickness)



    barcodes = []
    picam2.post_callback = draw_barcodes
    picam2.start_preview(Preview.QTGL)
    picam2.start()
    while True:
        rgb = picam2.capture_array("main")
        barcodes = decode(rgb)
        if len(barcodes) == 1:
            return barcodes[0].data.decode("utf-8")


# For debug
if __name__ == "__main__":
    while True:
        try:
            print(eval(input(">>> ")))
        except KeyboardInterrupt:
            break
        except:
            continue