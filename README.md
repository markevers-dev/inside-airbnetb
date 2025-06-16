# 🏠Inside Airbnetb

The goal of the project is to provide (fictional) management at [InsideAirbnb](https://insideairbnb.com/) with actionable insights into Airbnb usage across different neighbourhoods in Copenhagen.

## 📝 Background of the Project

This application was was developed as an assignment for the I-NotS WAPP 2025 P4 course at the HAN University of Applied Sciences. It received a final grade of UNGRADED.
The data which was used for this application was sourced from Inside Airbnb on 05/06/2025 ([https://insideairbnb.com/get-the-data/](https://insideairbnb.com/get-the-data/))

## 🚀 Functions

- **🔐 User Registration & Authentication**: Secure login and registration functionality. Authentication via [Auth0](https://auth0.com/).
- **🧑‍💼 User Roles & Authorization**: Role-based access (e.g. ADMIN). Only authorized users can view business intelligence charts
- **🗂️ Filtering Options**: Filter listings by price, neighborhood, and review score.
- **🗺️ Interactive Map View**: [Mapbox](https://www.mapbox.com/) integration to display search results visually. Clickable map markers display detailed listing information in a side panel.
- **📊 Admin Dashboard with Analytics**: Visualizations such as Average availability per month, Average price per neighborhood & Revenue per neighborhood. Only accessible by users with ADMIN role.
- **📈 Performance & Scalability**: Load testing with [NBomber](https://nbomber.com/). Performance metrics before/after optimizations. 
- **🔐 Security**: [OWASP ZAP](https://www.zaproxy.org/) used for scanning and fixing vulnerabilities. Dependencies scanned for vulnerabilities using [Snyk](https://snyk.io/).
- **⚡ Distributed Caching**: [Redis](https://redis.io/) integration for faster access to frequently used data.
 
## ⚙️ Technical Details

| Stack |  Description  |
|:-----|--------:|
| Frontend   | Next.js 15 with Tailwind CSS 4 and component library 8bitcn/ui |
| Backend   |  Asp.Net Core 9, C#  |
| Database   | Microsoft SQL Server |
| Authentication   | Auth0 |
| Caching   | Redis Cache |
| Testing Tools   | NBomber, OWASP ZAP, Snyk |
| Map Integration  | Mapbox |

## 🧾 License

This project is created for educational purposes only and is not intended for commercial use.
