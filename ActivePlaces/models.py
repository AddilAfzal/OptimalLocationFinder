from django.db import models

from Core.models import Location


class Equipment(models.Model):
    tableTennisTables = models.IntegerField(default=0)
    poolHoist = models.IntegerField(default=0)
    bowlingMachine = models.IntegerField(default=0)
    trampolines = models.IntegerField(default=0)
    parallelBars = models.IntegerField(default=0)
    highBars = models.IntegerField(default=0)
    stillRings = models.IntegerField(default=0)
    unevenBars = models.IntegerField(default=0)
    balanceBeam = models.IntegerField(default=0)
    vault = models.IntegerField(default=0)
    pommelHorse = models.IntegerField(default=0)


class Activity(models.Model):
    name = models.CharField(max_length=30)

    def __str__(self):
        return self.name


class Contacts(models.Model):
    contactType = models.CharField(max_length=30)
    email = models.EmailField(null=True)
    telephone = models.CharField(max_length=60, null=True)
    website = models.URLField(null=True, max_length=400)


class Disability(models.Model):
    access = models.BooleanField(null=True)
    notes = models.CharField(max_length=1000, null=True)
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
    buildingName = models.CharField(max_length=100, null=True)
    buildingNumber = models.CharField(max_length=20)
    hasCarPark = models.BooleanField(default=False)
    carParkCapacity = models.IntegerField()
    dedicatedFootballFacility = models.BooleanField(default=False)
    cyclePark = models.BooleanField(default=False)
    cycleHire = models.BooleanField(default=False)
    cycleRepairWorkshop = models.BooleanField(default=False)
    nursery = models.BooleanField(default=False)
    ownerType = models.CharField(max_length=60)
    equipment = models.OneToOneField(Equipment, on_delete=models.CASCADE)
    disability = models.OneToOneField(Disability, on_delete=models.CASCADE)
    contact = models.OneToOneField(Contacts, on_delete=models.CASCADE, null=True)
    activities = models.ManyToManyField(Activity)

    def __str__(self):
        return self.name


class Facility(models.Model):
    active_place = models.ForeignKey(ActivePlace, on_delete=models.CASCADE)
    facilityType =  models.CharField(max_length=30)
    yearBuilt = models.IntegerField(null=True)
    yearBuiltEstimated = models.BooleanField(default=False)
    isRefurbished = models.BooleanField(default=False)
    yearRefurbished = models.IntegerField(null=True)
    hasChangingRooms = models.BooleanField(null=True)
    areChangingRoomsRefurbished = models.BooleanField(null=True)
    yearChangingRoomsRefurbished = models.IntegerField(null=True)
    # Opening times - implemented
    # facilitySpecifics - disability -- not added
    seasonalityType = models.CharField(max_length=30)
    seasonalityStart = models.CharField(max_length=30)
    seasonalityEnd = models.CharField(max_length=30)


class OpeningTimes(models.Model):
    facility = models.ForeignKey(Facility, on_delete=models.CASCADE)
    accessDescription = models.CharField(max_length=100)
    openingTime = models.CharField(max_length=20)
    closingTime = models.CharField(max_length=20)
    periodOpenFor = models.CharField(max_length=50)

    def __str__(self):
        return "%s - (%s - %s)" % (self.periodOpenFor, self.openingTime, self.closingTime)
