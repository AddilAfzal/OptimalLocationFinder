import json
import urllib.request


def postcode_lookup(postcodes):
    obj = { 'postcodes': postcodes}
    url = "http://api.postcodes.io/postcodes"

    req = urllib.request.Request(url)
    req.add_header('Content-Type', 'application/json')

    jsondata = json.dumps(obj)
    jsondataasbytes = jsondata.encode('utf-8')
    req.add_header('Content-Length', len(jsondataasbytes))
    print(jsondataasbytes)
    response = urllib.request.urlopen(req, jsondataasbytes)
    resp_data = json.loads(response.read())

    return resp_data['result']