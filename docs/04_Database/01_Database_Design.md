# Database Design

## Database Entities

* Users
* Study Goals
* Subjects
* Topics
* Study Plans
* Tasks
* Progress
* Notifications
* AI History

## Entity Relationships

* One User can have multiple Study Goals.
* One Study Goal can have multiple Subjects.
* One Subject can have multiple Topics.
* One Study Goal can have one or more Study Plans.
* One Study Plan can have multiple Tasks.
* One Task belongs to one Topic.
* One User can have multiple Notifications.
* One User can have multiple AI History records.

## Entity Relationships

| Parent Entity | Relationship | Child Entity  |
| ------------- | ------------ | ------------- |
| User          | 1 : N        | Study Goals   |
| Study Goal    | 1 : N        | Subjects      |
| Subject       | 1 : N        | Topics        |
| Study Goal    | 1 : N        | Study Plans   |
| Study Plan    | 1 : N        | Tasks         |
| Topic         | 1 : N        | Tasks         |
| User          | 1 : N        | Notifications |
| User          | 1 : N        | AI History    |


