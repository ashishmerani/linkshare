# linkshare

####Prerequisite before starting the application.
  - Active Internet connection to load the scripts from cdn.
  - Git
  - Node.js and npm
  - Mongo
  - Port 3000 should be free and process of mongo should not be running; if running it is recommended to kill it.  
  
 ####Assuming that you are using node-box provided as a part of the assignment. Navigate to node-box folder then home/vagrant. 
  - Type the following command
	`mkdir -p ./mongodb/data`
 - In the home vagrant directory clone the git repository  
  `git clone https://github.com/ashishmerani/linkshare.git`  
  `cd linkshare`  
Now type `npm install`   
Type `foreman start -f Procfile`

Application will start on 3000 port.
