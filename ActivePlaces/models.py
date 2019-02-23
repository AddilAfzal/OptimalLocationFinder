from django.db import models

from Core.models import Location


class Equipment(models.Model):
    tableTennisTables = models.BooleanField(default=False)
    poolHoist = models.BooleanField(default=False)
    bowlingMachine = models.BooleanField(default=False)
    trampolines = models.BooleanField(default=False)
    parallelBars = models.BooleanField(default=False)
    highBars = models.BooleanField(default=False)
    stillRings = models.BooleanField(default=False)
    unevenBars = models.BooleanField(default=False)
    balanceBeam = models.BooleanField(default=False)
    vault = models.BooleanField(default=False)
    pommelHorse = models.BooleanField(default=False)


class Activity(models.Model):
    name = models.CharField(max_length=30)

    def __str__(self):
        return self.name


class Contacts(models.Model):
    contactType = models.CharField(max_length=30)
    email = models.EmailField()
    telephone = models.CharField(max_length=30)
    website = models.URLField()


class Disability(models.Model):
    access = models.BooleanField()
    notes = models.CharField(max_length=200, null=True)
    parking = models.BooleanField()
    findingReachingEntrance = models.BooleanField()
    receptionArea = models.BooleanField()
    doorways = models.BooleanField()
    changingFacilities = models.BooleanField()
    activityAreas = models.BooleanField()
    toilets = models.BooleanField()
    socialAreas = models.BooleanField()
    spectatorAreas = models.BooleanField()
    emergencyExits = models.BooleanField()


class ActivePlace(Location):
    active_place_id = models.IntegerField(primary_key=True, db_index=True) # AKA id
    state = models.CharField(max_length=30)
    kind = models.CharField(max_length=30)
    outputAreaCode = models.CharField(max_length=30)
    lowerSuperOutputArea = models.CharField(max_length=30)
    middleSuperOutputArea = models.CharField(max_length=30)
    parliamentaryConstituencyCode = models.CharField(max_length=30)
    parliamentaryConstituencyName = models.CharField(max_length=60)
    wardCode = models.CharField(max_length=30)
    wardName = models.CharField(max_length=60)
    localAuthorityCode = models.CharField(max_length=30)
    localAuthorityName = models.CharField(max_length=60)
    buildingName = models.CharField(max_length=100)
    buildingNumber = models.CharField(max_length=20)
    hasCarPark = models.BooleanField(default=False)
    carParkCapacity = models.IntegerField()
    dedicatedFootballFacility = models.BooleanField(default=False)
    cyclePark = models.BooleanField(default=False)
    cycleHire = models.BooleanField(default=False)
    cycleRepairWorkshop = models.BooleanField(default=False)
    nursery = models.BooleanField(default=False)
    ownerType = models.CharField(max_length=30)
    equipment = models.OneToOneField(Equipment, on_delete=models.DO_NOTHING)
    disability = models.OneToOneField(Disability, on_delete=models.DO_NOTHING)

    def __str__(self):
        return self.name


class Facility(models.Model):
    active_place = models.ForeignKey(ActivePlace, on_delete=models.DO_NOTHING)
    facilityType =  models.CharField(max_length=30)
    yearBuilt = models.IntegerField()
    yearBuiltEstimated = models.BooleanField(default=False)
    isRefurbished = models.BooleanField(default=False)
    yearRefurbished = models.IntegerField()
    hasChangingRooms = models.BooleanField()
    areChangingRoomsRefurbished = models.BooleanField()
    yearChangingRoomsRefurbished = models.IntegerField()
    # Opening times - implemented
    # facilitySpecifics - disability -- not added
    seasonalityType = models.CharField(max_length=30)
    seasonalityStart = models.CharField(max_length=30)
    seasonalityEnd = models.CharField(max_length=30)


class OpeningTimes(models.Model):
    facility = models.ForeignKey(Facility, on_delete=models.DO_NOTHING)
    accessDescription = models.CharField(max_length=100)
    openingTime = models.CharField(max_length=20)
    closingTime = models.CharField(max_length=20)
    periodOpenFor = models.CharField(max_length=50)

    def __str__(self):
        return "%s - (%s - %s)" % (self.periodOpenFor, self.openingTime, self.closingTime)
