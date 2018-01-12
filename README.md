# Human Phenotype Ontology (HPO) Web App

The following guide provides the steps for an out-of-the-box setup for the Human Phenotype Ontology (HPO) Web application with minimum requirements for a local development environment. 
                    
This guide uses the H2 database which is a grails out-of-the-box in-memory or file-base database for quick setup of small-low-volume projects.  
                    

## Requirements

+ Java 1.8
* Git (Latest)


## Setup

+ Clone the repo:

  JAX Bitbucket (Internal)

        git clone https://bitbucket.jax.org/scm/hpo/hpo-web.git
        
  JAX Github 
        
        git clone https://github.com/TheJacksonLaboratory/hpo-web.git
        
+ Change directory to hpo-web

        cd hpo-web

+ Build the application with a gradle task. If everything is fine, this step should finish with a success build after compiling and running unit tests. Run this command in the command window in the hpo-web directory.  

        ./gradlew clean build
        
        E.g.
        ...
        :processTestResources
        :testClasses
        :test
        :check
        :build
         
        BUILD SUCCESSFUL
         
        Total time: 1 mins 29.306 secs

+ Initialize the H2 DB and load the HPO ontology data. Run the following command in the command window inside the hpo-web directory. This step will take approximate 2+ minutes to complete
         
        ./gradlew runCommand -Pargs="load-hpo-db"
        
        E.g. when complete the output in the command window should look like this:
        ...
        finished refreshing database duration: 0:02:49.391 time: Thu Jan 11 11:28:56 EST 2018
         
        BUILD SUCCESSFUL
        
        Note:
        If you desire to re-initialize the application and the database, execute the gradle clean and build command in the command line window, after shutting down the application
        
        E.g. in the command line where the hpo-web app is running (hpo-web dir), run these commands
        
        ctrl + c to stop the current process
        
        ./gradlew clean build to clean and rebuild the application. It drops the current database and data
        
        ./gradlew runCommand -Pargs="load-hpo-db" to initialize and reload the ontology data
        
        ./gradlew bootRun to restart the application    

## Usage

+ Run the hpo-web application. This step will launch the application in the local web container and make it available through the web browser

        ./gradlew bootRun

+ To open the application site launch the browser and go to
 
        http://<host>:8080/app/index.html

+ If client (Angular App) hot reload is desired open a new shell and execute

        ./gradlew buildClientWatch

+ Optionally to open the client (Angular app) via Cli

  * Change directory to hpo-web/src/main/client
  
        cd hpo-web/src/main/client  
  * Execute
  
        ng serve --open (will open application in the browser using port 4200)
  
## Unit Testing

+ To execute the client (Angular app) unit tests run
  
      ./gradlew clientTest

+ To execute backend and client unit tests run
  
      ./gradlew test
    
## Other
+ To see possible gradle tasks execute
  
      ./gradlew tasks
      
+ To delete the previous build execute

      ./gradlew clean
      

