import json
import operator

sorted_out=[]
with open('classes-title-description.json') as json_data:
	d= json.load(json_data)
	print d
	sorted_out = sorted(d.items(), key=operator.itemgetter(0))
with open('classes-title-description.json',"w") as json_data:
	json.dump(sorted_out,json_data)
