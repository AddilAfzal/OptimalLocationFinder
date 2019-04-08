from _decimal import Decimal

from django.test import TestCase

from Core.methods import get_closest_locations, get_closest_location


class ClosestLocationTestCase(TestCase):
    def setUp(self):
        self.locations = [{'lat': Decimal('51.504807'), 'lng': Decimal('-0.470537')},
                          {'lat': Decimal('51.509476'), 'lng': Decimal('0.005619')},
                          {'lat': Decimal('51.509476'), 'lng': Decimal('0.005619')},
                          {'lat': Decimal('51.509476'), 'lng': Decimal('0.005619')},
                          {'lat': Decimal('51.509476'), 'lng': Decimal('0.005619')},
                          {'lat': Decimal('51.509476'), 'lng': Decimal('0.005619')}]

    def test_get_nearest_one(self):
        """Test that the closest point to a location is returned, with the correct distance in KM"""
        location = (51.608116, -0.163689)
        distance, index = get_closest_location(location[0], location[1], self.locations)

        self.assertEqual(round(distance,2), 16.08)
        self.assertEqual(index, 1)

    def test_get_nearest_two(self):
        """Test that the closest 2 points to a location are returned, with the correct distance in KM"""

        location = (51.608116, -0.163689)
        distance_index_array = get_closest_locations(location[0], location[1], self.locations, 2)

        points = list(zip(distance_index_array[0][0], distance_index_array[1][0]))

        self.assertEqual(round(points[0][0], 2), 16.08)
        self.assertEqual(points[0][1], 1)

        self.assertEqual(round(points[0][0], 2), 16.08)
        self.assertEqual(points[0][1], 1)

        self.assertEqual(points.__len__(), 2)