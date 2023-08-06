import argparse


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
    antitheft_background.launch()
    online.main()
elif launch == "burglar":
    import breakin
    breakin.main()
else:
    print("Invalid choice!")