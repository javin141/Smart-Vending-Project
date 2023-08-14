import argparse, os


parser = argparse.ArgumentParser()
parser.add_argument("-l", "--launch", type=str)

args = parser.parse_args()

launch = args.launch
print("Launched with", launch)

if launch == "selection":
    import selection, antitheft_background
    antitheft_background.launch()
    selection.main()
elif launch == "online":
    import online, antitheft_background
    from dotenv import load_dotenv
    load_dotenv(".env")
    print(os.getenv("MAIL_ADDR"))
    antitheft_background.launch()
    online.main()
elif launch == "burglar":
    import breakin
    breakin.main()
elif launch == "print_array":
    import Inventory_Array
else:
    print("Invalid choice!")
