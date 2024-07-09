# Remote Work Management
Welcome to the Remote Work Management platform, a comprehensive solution for efficient remote team management and collaboration.

![Remote Work Management Screenshot](./frontend/src/assets/Screenshot_Home.jpg)

## Features

- **Role-Based Access and Profiles**:
  - Employers can manage teams, job listings, and project progress.
  - Job seekers can create profiles, search for remote job opportunities, and apply through the platform.

- **Skill Matching and Recommendations**:
  - Utilizes Elasticsearch for job matching based on skills and preferences.
  - Offers upskilling recommendations tailored to user preferences.

- **Remote Work Productivity Analytics**:
  - Tracks productivity metrics like task completion rates and team performance.
  - Generates reports to identify trends and areas for improvement.

## Technologies Used

### Backend Development
- **Server**: Node.js with Express.js
- **Authentication**: JWT (JSON Web Tokens)
- **Database**: MySQL
- **APIs**: Integration with Zoom, Google Docs, and Trello APIs

### Frontend Development
- **Framework**: React.js
- **UI Development**: Responsive interfaces for profiles, job listings, and analytics dashboards

### Integration and Deployment
- **Hosting**: Vercel
- **Containerization**: Docker
- **Monitoring**: New Relic, Sentry

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/Isaacmwangi/remote-work-management.git

2. Navigate to the project directory: `cd remote-work-management`
3. Install dependencies: `npm install`
4. Set up environment variables: Create a `.env` file based on `.env` and configure it accordingly.
5. Start the server: `npm start`
6. Start the frontend: Navigate to the `remote-work-management-frontend` directory and run `npm start`

## Contributors

- Isaac Njuguna (@isaacmwangi)
- Alamin Juma (@alamin-juma)

