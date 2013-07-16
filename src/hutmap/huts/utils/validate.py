from csv_consts import CSV_NULL

def assert_that(expression):
  if not expression: raise AssertionError

def assert_not_null(value):
  assert_that(value != CSV_NULL)


## assert type ##

def assert_integer_ge_zero(value):
  val = int(value)
  assert_that(val >= 0)

def assert_float(value):
  float(value)

def assert_float_ge_zero(value):
  val = float(value)
  assert_that(val >= 0)

def assert_bool(value):
  val = int(value)
  assert_that(val == 1 or val == 0)

def assert_url(value):
  assert_that(value.startswith('http'))


## assert type or null ##

def assert_x_or_null(value, fn):
  if value != CSV_NULL:
    fn(value)

def assert_integer_ge_zero_or_null(value):
  assert_x_or_null(value, assert_integer_ge_zero)

def assert_float_or_null(value):
  assert_x_or_null(value, assert_float)

def assert_float_ge_zero_or_null(value):
  assert_x_or_null(value, assert_float_ge_zero)

def assert_bool_or_null(value):
  assert_x_or_null(value, assert_bool)

def assert_url_or_null(value):
  assert_x_or_null(value, assert_url)


## validators ##

def validate_access_no_snow(value):
  pass
    
def validate_agency_url(value):
  pass

def validate_agency_name(value):
  pass

def validate_agency_parent(value):
  pass

def validate_alternate_names(value):
  pass

def validate_altitude_meters(value):
  assert_integer_ge_zero_or_null(value)

def validate_backcountry(value):
  assert_that(value == CSV_NULL or int(value) in [0,1,2,3])

def validate_capacity_hut_max(value):
  assert_integer_ge_zero_or_null(value)

def validate_capacity_hut_min(value):
  assert_integer_ge_zero_or_null(value)

def validate_capacity_max(value):
  assert_integer_ge_zero_or_null(value)

def validate_country(value):
  assert_not_null(value)

def validate_date_updated(value):
  assert_not_null(value)

def validate_designations(value):
  pass

def validate_discretion(value):
  assert_bool_or_null(value)

def validate_fee_hut_max(value):
  assert_float_ge_zero_or_null(value)

def validate_fee_hut_min(value):
  assert_float_ge_zero_or_null(value)

def validate_fee_hut_occupancy_max(value):
  assert_integer_ge_zero_or_null(value)

def validate_fee_method(value):
  assert_that(value == CSV_NULL or int(value) in [0,1,2])

def validate_fee_person_max(value):
  assert_float_ge_zero_or_null(value)

def validate_fee_person_min(value):
  assert_float_ge_zero_or_null(value)

def validate_fee_person_occupancy_min(value):
  assert_integer_ge_zero_or_null(value)

def validate_has_optional_services(value):
  assert_bool_or_null(value)

def validate_has_services(value):
  assert_bool_or_null(value)

def validate_hut_url(value):
  assert_url_or_null(value)

def validate_is_fee_hut(value):
  assert_bool_or_null(value)

def validate_is_fee_hut_occupancy_max(value):
  assert_bool_or_null(value)

def validate_is_fee_person(value):
  assert_bool_or_null(value)

def validate_is_fee_person_occupancy_min(value):
  assert_bool_or_null(value)

def validate_is_restricted(value):
  assert_bool_or_null(value)

def validate_is_snow_min_km(value):
  assert_bool_or_null(value)

def validate_latitude(value):
  assert_float_or_null(value)

def validate_location_accuracy(value):
  assert_that(value == CSV_NULL or int(value) in [1,2,3,4,5])

def validate_location_references(value):
  pass

def validate_locked(value):
  assert_bool_or_null(value)

def validate_longitude(value):
  assert_float_or_null(value)

def validate_name(value):
  pass

def validate_no_snow_min_km(value):
  assert_float_or_null(value)

def validate_open_summer(value):
  assert_bool_or_null(value)

def validate_open_winter(value):
  assert_bool_or_null(value)

def validate_photo_credit_name(value):
  pass

def validate_photo_credit_url(value):
  assert_url_or_null(value)

def validate_photo_url(value):
  assert_url_or_null(value)

def validate_private(value):
  assert_bool_or_null(value)

def validate_published(value):
  assert_bool_or_null(value)

def validate_region(value):
  pass

def validate_reservations(value):
  assert_bool_or_null(value)

def validate_restriction(value):
  pass

def validate_services(value):
  pass

def validate_show_satellite(value):
  assert_bool_or_null(value)

def validate_snow_min_km(value):
  assert_float_or_null(value)

def validate_state(value):
  pass

def validate_structures(value):
  assert_integer_ge_zero_or_null(value)

def validate_systems(value):
  pass

def validate_types(value):
  pass

