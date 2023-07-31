import argparse, selection

parser = argparse.ArgumentParser()
parser.add_argument("-l", "--launch", type=str)

args = parser.parse_args()

launch = args.launch

if launch == "selection":
    selection.main()
else:
    print("Invalid choice!")