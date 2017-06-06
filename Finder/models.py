from __future__ import unicode_literals

from django.db import models

from math import sqrt

import googlemaps

# Create your models here.
class psf(object):

    def __init__(self, lat, lon, name, cod):
        self.lat = lat
        self.lon = lon
        self.name = name.encode("utf8")
        self.cod = cod

    def __str__(self):
        return "Id: " + self.cod + " Nome: " + self.name + " lat : " + str(self.lat) + " lon: " + str(self.lon)

class location(object):
    def __init__(self, lat, lon):
        self.lat = lat
        self.lon = lon

class google_maps_connector(object):
    """Google Maps API"""
    def __init__(self):
        self.__key = 'AIzaSyDj8reE3d4I2myzmQ0YDXcIQQaYPdpEJik'

    def connect(self):
        return googlemaps.Client(key=self.__key)

class google_places(object):
    """Google Places API wrapper"""
    def __init__(self):
        self.__google_places_client = google_maps_connector().connect()
        self.places = []
        self.cur_location = location(lat=-7.149053, lon=-34.842709)
        self.distances = []
        self.cod = 0;

    def get_psfs_nearby(self):
        self.places.append(self.cur_location)
        result = self.__google_places_client.places('psf', location=(-7.149053, -34.842709),
                           radius=1, language='pt-BR')
        
        for item in result['results']:
            self.places.append(psf(lat=item['geometry']['location']['lat'], lon=item['geometry']['location']['lng'], name=item['name'], cod = self.cod))
            self.cod += 1

    def euclidian_dist(self, x0, y0, x1, y1):
        return float(sqrt(((x0 - x1)**2) + ((y0 - y1)**2)))

    def distance_calc(self):
        for i in range(len(self.places)):
            row = []
            for j in range(len(self.places)):
                row.append(self.euclidian_dist(self.places[i].lat, self.places[i].lon, self.places[j].lat, self.places[j].lon))
            self.distances.append(row)

    def ret_psf(self):
        return self.places

    def list_distances(self):
        for i in self.distances:
            print i