import xml.etree.ElementTree as ET
import json

def generate_tmx(filename, width, height, tilewidth, tileheight, tileset_image, tilemap):
    map_element = ET.Element("map", {
        "version": "1.10",
        "tiledversion": "1.11.2",
        "orientation": "orthogonal",
        "renderorder": "right-up",
        "width": str(width),
        "height": str(height),
        "tilewidth": str(tilewidth),
        "tileheight": str(tileheight),
        "infinite": "0",
        "nextlayerid": "2",
        "nextobjectid": "1"
    })
    
    editorsettings = ET.SubElement(map_element, "editorsettings")
    ET.SubElement(editorsettings, "export", {"target": "map1.csv", "format": "csv"})
    
    tileset = ET.SubElement(map_element, "tileset", {
        "firstgid": "1",
        "name": "sprites",
        "tilewidth": str(tilewidth),
        "tileheight": str(tileheight),
        "tilecount": "6",
        "columns": "3"
    })
    ET.SubElement(tileset, "image", {"source": tileset_image, "width": "96", "height": "64"})
    
    layer = ET.SubElement(map_element, "layer", {
        "id": "1",
        "name": "Tile Layer 1",
        "width": str(width),
        "height": str(height)
    })
    
    data = ET.SubElement(layer, "data", {"encoding": "csv"})
    tile_data = str(tilemap)
    data.text = tile_data
    
    tree = ET.ElementTree(map_element)
    tree.write(filename, encoding="UTF-8", xml_declaration=True)


def Json_to_tilemap(data):
    # Creating sky 
    tilemap = [[1 for _ in range(50)] for _ in range(15)]

    # Creating ground
    for i in range(50):
        for j in range(12,15):
            tilemap[j][i]=2

    # Creating platforms
    for i in range(len(data["platforms"])):
        for j in range(data["platforms"][i]["length"]):
            tilemap[15-data["platforms"][i]["y"]][data["platforms"][i]["x"]+j] = 3

    # Creating holes
    for i in range(len(data["holes"])):
        for j in range(data["holes"][i]["length"]):
            tilemap[14][data["holes"][i]["x"]+j] = 1
            tilemap[13][data["holes"][i]["x"]+j] = 1
            tilemap[12][data["holes"][i]["x"]+j] = 1


    # Creating keys
    tilemap[15-data["key"]["y"]][data["key"]["x"]] = 4

    # Creating doors
    tilemap[15-data["exitDoor"]["y"]][data["exitDoor"]["x"]] = 6

    # Creating enemies
    for i in range(len(data["enemies"])):
        tilemap[15-data["enemies"][i]["y"]][data["enemies"][i]["x"]+j] = 5


    tilemap_str = ",".join(",".join(map(str, row)) for row in tilemap)
    #print(tilemap_str)
    return tilemap_str


# # Read the file
# with open("level0.txt", "r") as file:
#     content = file.read()

# # Parse JSON array
# json_objects = json.loads(content)

# # Print parsed objects
# i=1
# for obj in json_objects:
#     name="level"+str(i)+".tmx"
#     generate_tmx(name, 50, 15, 32, 32, "sprites.png", Json_to_tilemap(obj))
#     i=i+1
# print(i)
# #generate_tmx("level.tmx", 50, 15, 32, 32, "sprites.png", Json_to_tilemap(data))
