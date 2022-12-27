# Human Phenotype Ontology (HPO) Web App

The following guide provides the steps for an out-of-the-box setup for the Human Phenotype Ontology (HPO) Web application with minimum requirements for a local development environment. 

## Requirements

+ Java@11
+ mysql@5.7

## Setup

+ Clone the repo:
 
  JAX Github 
        
        git clone git@github.com:TheJacksonLaboratory/hpo-web.git

+ Initialize the mysql database and load the HPO ontology data. Run the following command in the command window inside the hpo-web directory. This step will take approximate 3+ minutes to complete
         
        ./gradlew server:runCommand -Pargs="load-hpo-db"
        
        E.g. when complete the output in the command window should look like this:
        ...
        finished refreshing database duration: 0:03:49.391 time: Thu Jan 11 11:28:56 EST 2018
         
        BUILD SUCCESSFUL
        
        Note:
        If you desire to re-initialize the application and the database, execute the command again.
        

+ Build the application with a gradle task.

        ./gradlew build -DchromeHeadless=true
        
        E.g.
        ...
        :processTestResources
        :testClasses
        :test
        :check
        :build
         
        BUILD SUCCESSFUL
         
        Total time: 1 mins 29.306 secs

  
+ War creation with a gradle task.

      ./gradlew clean war -Dgrails.env=[stage, gcp, production]>
       
      Will output a war to ./build/libs/

## Usage

+ Run the hpo-web application. This step will launch the application in the local web container and make it available through the web browser

        ./gradlew bootRun
        * if you are looking to use the grails console provide argument `-Dgrails.console=true`

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

+ To execute the client (Angular app) unit tests, run
  
      ./gradlew clientTest

+ To execute backend and client unit tests, run
  
      ./gradlew test
      
## Functional Testing

+ To execute functional testing with chrome browser, run
  
      ./gradlew integrationTest

+ To execute functional testing with chrome headless browser, run
  
      ./gradlew integrationTest -DchromeHeadless

