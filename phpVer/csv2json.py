#!/bin/python
import json

with open("classes-extended.csv") as f:
	classes={}
	for line in f:
		line=line[:-1]
		parts=line.split(",")
		classes[parts[1]]=[parts[2],parts[4],parts[28]]
	open("classes.json","w").write(json.dumps(classes)).close()
