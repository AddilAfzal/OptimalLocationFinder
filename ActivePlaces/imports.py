import json


def import_data(data_path="Core/data/Active Places Open Data_2019_02_15.sites.json"):

    with open(data_path) as f:
        data = json.load(f)

