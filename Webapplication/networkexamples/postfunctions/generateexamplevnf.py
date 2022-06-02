import sys

#script by Charlotte Rupp to generate service function examples. Commata have to be deleted for the last elements in "nodes"


print('generate example')

original_stdout = sys.stdout

with open('examplevnf.txt', 'w') as f:
    sys.stdout = f
    print(""" curl -X POST localhost:8000/vnfs/  -H "Content-Type: application/json" -d '{"Network":{
    "nodes":[""")
    for i in range(0, 5000):
        print('''            {
            "id":'''+str(i)+
            ''',
            "owner": "c6f63de5-5e2f-44d7-8b9f-c9d646f3ff67",
            "applicationName": "dummy1",
            "serviceType": "packetsniffer",
            "bidirectional": "FALSE",
            "ebpf": true,
            "virtualization": "container",
            "vcpus": 1,
            "vmemory": 1,
            "firewallRules": "None",
            "vnf_host": "test'''+str(i)+
            '''",
            "vnf_label": 105,
            "ip_address": "10.180.241.170",
            "virtual_network_port": 133
            },''')
    
    print('''    ]
}

   }'                                                                                                                                                                                              
''')
    sys.stdout = original_stdout