class obj(object):
    def __init__(self, d):
        for a, b in d.items():
            if isinstance(b, (list, tuple)):
               setattr(self, a, [obj(x) if isinstance(x, dict) else x for x in b])
            else:
               setattr(self, a, obj(b) if isinstance(b, dict) else b)

def getCamleCase(name):
	name = name.lower()
	parts = name.split("_")
	
	variable = parts.pop(0)
	for i in xrange(len(parts)):
		variable += parts[i][0].upper() + parts[i][1:]

	return variable

