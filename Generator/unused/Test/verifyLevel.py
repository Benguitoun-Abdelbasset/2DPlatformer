import json
import random
import os
import shutil

def XYlengthToArray(object):
    arr=[]
    for i in range(object['length']):
        arr.append({"x":(object['x']+i),"y":object['y']})
    return arr

def platAboveGround(plat):
    if(plat['y']<4):
        return False
    else:
        return True
#returns false if the platform is not reachable from the ground or another platform
def reachable(platform,otherPlats):
    def leftEdge(plat):
        return XYlengthToArray(plat)[0]
    def rightEdge(plat):
        return XYlengthToArray(plat)[-1]
    
    reach=False

    if(platform['y']<8):
        reach=True
    else:
        for other in otherPlats:
            for i in range(5):
                for j in range(4):
                    # if it's directly under check if there is space for player
                    if(rightEdge(other)['x']<= rightEdge(platform)['x'] and leftEdge(other)['x']>= leftEdge(platform)['x']):
                        if(platform['y']-other['y']<3):
                            return False
                    for oth in XYlengthToArray(other):
                        if(oth['x']==rightEdge(platform)['x']+i  and oth['y']==rightEdge(platform)['y']-j ):
                            newother = [p for p in otherPlats if p != other]
                            if(reachable(other,newother)):
                                reach=True
                        if(oth['x']==leftEdge(platform)['x']-i  and oth['y']==leftEdge(platform)['y']-j ):
                            newother = [p for p in otherPlats if p != other]
                            if(reachable(other,newother)):
                                reach=True
                        if(oth['x']==rightEdge(platform)['x']+i  and oth['y']==rightEdge(platform)['y']+j ):
                            newother = [p for p in otherPlats if p != other]
                            if(reachable(other,newother)):
                                reach=True
                        if(oth['x']==leftEdge(platform)['x']-i  and oth['y']==leftEdge(platform)['y']+j ):
                            newother = [p for p in otherPlats if p != other]
                            if(reachable(other,newother)):
                                reach=True
                        
    return reach

# takes a level and says if its platforms are reachable from ground or other platforms
def checkPlatforms(level):

    # fix the plats in the ground 
    for plat in level['platforms']:
        if(not platAboveGround(plat)):
            plat['y']=random.randint(4, 6)
    #check if at least one platform is near the ground
    i=0
    j=0
    for plat in level['platforms']:
        if(plat['y']<8):
            j=1
            i=1
    if(i==0 and j==1):
        return False
    

    #check if platforms not near the ground are reachable from other platforms
    for plat in level['platforms']:
        otherplats = [p for p in level["platforms"] if p != plat]
        if(not reachable(plat,otherplats)):
            return False
        
    return True

def itemOnSolid(item,level):
    #check if item is in a platform
    for plat in level['platforms']:
        if(item in XYlengthToArray(plat)):
            return "inplat"
    #check if item is on a platform
    temp=item.copy()
    temp['y']=temp['y']-1
    for plat in level['platforms']:
        if(temp in XYlengthToArray(plat)):
            return "onplat"
    #check if item is in the air
    if(item['y']>4):
        return "inair"
    #check if item is in a hole
    for hole in level['holes']:
        for tile in XYlengthToArray(hole):
            if(item['x']==tile['x']):
                return "inhole"
    #check if item in the ground
    if(item['y']<4):
        return "inground"
    
    return "onground"


def fixLevelItems(level):
    c=0
    while(c==0):
        if(itemOnSolid(level['key'],level)=="onground" or itemOnSolid(level['key'],level)=="onplat"):
            c=1
        if(itemOnSolid(level['key'],level)=="inair"):
            level['key']['y']=level['key']['y']-1
        if(itemOnSolid(level['key'],level)=="inhole"):
            level['key']['x']=level['key']['x']+1
        if(itemOnSolid(level['key'],level)=="inplat"):
            level['key']['y']=level['key']['y']+1
        if(itemOnSolid(level['key'],level)=="inground"):
            level['key']['y']=level['key']['y']+1

    c=0
    while(c==0):
        if(itemOnSolid(level['exitDoor'],level)=="onground" or itemOnSolid(level['exitDoor'],level)=="onplat"):
            c=1
        if(itemOnSolid(level['exitDoor'],level)=="inair"):
            level['exitDoor']['y']=level['exitDoor']['y']-1
        if(itemOnSolid(level['exitDoor'],level)=="inhole"):
            level['exitDoor']['x']=level['exitDoor']['x']+1
        if(itemOnSolid(level['exitDoor'],level)=="inplat"):
            level['exitDoor']['y']=level['exitDoor']['y']+1
        if(itemOnSolid(level['exitDoor'],level)=="inground"):
            level['exitDoor']['y']=level['exitDoor']['y']+1

    for enemy in level['enemies']:
        c=0
        while(c==0):
            if(itemOnSolid(enemy,level)=="onground" or itemOnSolid(enemy,level)=="onplat"):
                c=1
            if(itemOnSolid(enemy,level)=="inair"):
                enemy['y']=enemy['y']-1
            if(itemOnSolid(enemy,level)=="inhole"):
                enemy['x']=enemy['x']+1
            if(itemOnSolid(enemy,level)=="inplat"):
                enemy['y']=enemy['y']+1
            if(itemOnSolid(enemy,level)=="inground"):
                enemy['y']=enemy['y']+1



    return level

def main():
    all_data = []

    #Folder path (change '.' to your folder if needed)
    folder_path = '.'


    #Loop over all files in the folder
    for filename in os.listdir(folder_path):
        if filename.startswith('test') and filename.endswith('.txt'):
            # Extract the part after 'test' and before '.txt'
            num_part = filename[4:-4]
            
            # Check if it's a number
            if num_part.isdigit():
                filepath = os.path.join(folder_path, filename)
                with open(filepath, 'r') as f:
                    try:
                        data = json.load(f)
                        for one in data:
                            all_data.append(one)
                    except json.JSONDecodeError as e:
                        print(f"Failed to load {filename}: {e}")


    good_data=[]
    bad_data=[]
    good_count=0
    bad_count=0


    for level in all_data:
        if(checkPlatforms(level)):
            level=fixLevelItems(level)
            good_data.append(level)
            good_count=good_count+1
        else:
            bad_data.append(level)
            bad_count=bad_count+1

    with open("good.txt", 'w') as file:
        json.dump(good_data, file, indent=2)



    with open("bad.txt", 'w') as file:
        json.dump(bad_data, file, indent=2)


    print(good_count," good ones")

    print(bad_count," bad ones")




main()

##########################   TEST CODE #############################


# #Read File
# filename = 'xx.txt'  
# with open(filename, 'r') as file:
#     try:
#         data = json.load(file)
#         print(f"Loaded {len(data)} JSON objects.")
#     except json.JSONDecodeError as e:
#         print(f"Failed to load JSON: {e}")


# data[0]=fixLevelItems(data[0])

# with open(filename, 'w') as file:
#     json.dump(data, file, indent=2)

######################################################################



##############################################   IDFK #########################################

# with open(filename, 'w') as file:
#     json.dump(data, file, indent=2)

# def isinground(data):
#     for level in data:
#         #check if enemy or key or door is in the ground
#         if(level['key']['y']<4):
#             level['key']['y']=4
#         if(level['exitDoor']['y']<4):
#             print(level['exitDoor']['y'])
#             level['exitDoor']['y']=4
#         for enemy in level['enemies']:
#             if(enemy['y']<4):
#                 enemy['y']=4
        

#         #check if enemy or key or door is in a hole
#         if(level['key']['y']<4):
#             level['key']['y']=4
#         if(level['exitDoor']['y']<4):
#             print(level['exitDoor']['y'])
#             level['exitDoor']['y']=4
#         for enemy in level['enemies']:
#             if(enemy['y']<4):
#                 enemy['y']=4
###########################################################################################

