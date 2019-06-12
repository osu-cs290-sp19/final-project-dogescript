#!/bin/python
import json
import re

def parseString(string):
	if (" or " in string or " and " in string) and string[0]!='(' and string[len(string)-1]!=')':
		string="("+string+")"
	lastString=""
	while string!=lastString:
		lastString=string
		string=re.sub('([A-Z]+) ((?:[0-9]+H|[0-9]+))\/ ([0-9]+)','\g<1> \g<2>, \g<1> \g<3>',string)
		string=re.sub('([A-Z]+) ((?:[0-9]+H|[0-9]+)) (or|and) ([0-9]+)','\g<1> \g<2> \g<3> \g<1> \g<4>',string)
	string=string.replace('/',',')
	# I think the above is safe
	string=re.sub('([A-Z]{2,4} (?:[0-9]{3}H|[0-9]{3}))','<\g<1>>',string)
	return string

with open("classes-extended.csv") as f:
	classes={}
	for line in f:
		line=line[:-1]
		parts=line.split(",")
	#	classes[parts[1]]=[parts[2],parts[4],parts[28]]
		classes[parts[1]]=parseString(parts[28])
	open("classes.json","w").write(json.dumps(classes))

exit()

string="((CH 123/ 223/ 226H or 233) and (CH 440/ CHE 331 or 331H) and (ENVE 321 or 322) and ENVE 421)"
# should be ((<CH 123>, <CH 223>, <CH 226H> or <CH 233>) and (<CH 440> or <CHE 331> or <331H>) and (<ENVE 321> or <ENVE 322>) and <ENVE 421>)

str1="((CH 123/ 223/ 226H or 233) and (CH 440/ CHE 331 or 331H) and (ENVE 321 or 322) and ENVE 421)"
strP1=parseString(str1)
str2="((MTH 111/ 112/ 231/ 241/ 245/ 251 or 251H) and (CH 122/ 222/ 232 or 232H))"
strP2=parseString(str2)
print(str1," -> ",strP1)
print(str2," -> ",strP2)
print(strP1=="((<CH 123>, <CH 223>, <CH 226H> or <CH 233>) and (<CH 440>, <CHE 331> or <CHE 331H>) and (<ENVE 321> or <ENVE 322>) and <ENVE 421>)")
