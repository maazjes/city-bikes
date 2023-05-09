<h2>To be implemented</h2>

**Authentication**
- Login for admin
- Admin can:
    - Import data from the CSV files to a database or in-memory storage

**importing data**
- Validate data before importing
- Don't import journeys that lasted for less than ten seconds
- Don't import journeys that covered distances shorter than 10 meters

**Listing journeys**
- Map view that lists each journey as a line between two stops
- Clicking on the line will show:
    - Departure time
    - Return time
    - Departure station name
    - Return station name
    - Covered distance
    - Duration
- Clicking on the stop will show:
    - Station name
    - Station address
    - Total number of journeys starting from the station
    - Total number of of journeys ending at the station
    - The average distance of a journey starting from the station
    - The average distance of a journey ending at the station
    - Top 5 most popular return stations for journeys starting from the station
    - Top 5 most popular departure stations for journeys ending at the station
    - Ability to filter all the calculations per month