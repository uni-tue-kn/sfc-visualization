import sys
#script by Charlotte Rupp to generate SFC host examples. Commata have to be deleted for the last elements in "nodes" and "links"


print('generate example')

original_stdout = sys.stdout

with open('example.txt', 'w') as f:
    sys.stdout = f
    print(""" curl -X POST localhost:8000/layer2/  -H "Content-Type: application/json" -d '{"Network":{
    "nodes":[""")
    for i in range(0, 5000):
        print('''                        {
                        "group": "1",
                        "id": "test''' + str(i)+'",')
         
        print('''                        "hostname": "machine-'''+str(i)+'''",
                        "username": "osboxes",
                        "ip_address": "192.168.122.10",
                        "hypervisor": "qemu+ssh://osboxes@192.168.122.10/system?no_verify=1",
                        "lxd_daemon": "https://192.168.122.10:8443",
                        "mpls_label": 100,
                        "net_iface_out": "ens3",
                        "MAC_address": "0c:21:c5:da:70:00"
                        },''')
    print(''']
    ,"links":[''')                    

    for i in range(0, 5000):
        print('                         {"source":"test'+str(i)+'", "target":"test'+str(i+1)+'", "value":10},')
        print('                         {"source":"test'+str(i+1)+'", "target":"test'+str(i)+'", "value":10},')
    
    print('''    ]
}

   }'                                                                                                                                                                                              
''')
    sys.stdout = original_stdout