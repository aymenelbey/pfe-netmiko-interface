from __future__ import absolute_import, division, print_function
import netmiko
import json
import re
import sys

from config import device

interfaces = []
connection = netmiko.ConnectHandler(**device)
output = connection.send_config_set(['end', 'config t', 'interface ' + sys.argv[1], sys.argv[2]])
print(output)


# print(json.dumps(interfaces))
connection.disconnect()