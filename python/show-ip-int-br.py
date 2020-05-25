from __future__ import absolute_import, division, print_function
import netmiko
import json
import re

from config import device

interfaces = []
connection = netmiko.ConnectHandler(**device)
lines = connection.send_command('show ip interface brief').splitlines()
lines.pop(0) # removing the first line which contains the ths
for line in lines:
    cols = line.split()
    interfaces.append({
        'name': cols[0],
        'ip': cols[1],
        'up': cols[4],
        'protocol': cols[5]
    })
print(json.dumps(interfaces))
connection.disconnect()