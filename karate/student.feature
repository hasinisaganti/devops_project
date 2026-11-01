Feature: Student Management API

Background:
  * url 'http://localhost:3456'

Scenario: Health check returns UP
  Given path 'health'
  When method get
  Then status 200
  And match response.status == 'UP'

Scenario: Get all students
  Given path 'students'
  When method get
  Then status 200
  And match response == '#array'

Scenario: Create a student
  Given path 'students'
  And request { name: 'Test User', email: 'test@example.com', course: 'DevOps' }
  When method post
  Then status 201
  And match response contains { name: 'Test User', course: 'DevOps' }
  And match response.id == '#number'

Scenario: Missing fields returns 400
  Given path 'students'
  And request { name: 'No Email' }
  When method post
  Then status 400

Scenario: Unknown student returns 404
  Given path 'students', 9999
  When method get
  Then status 404