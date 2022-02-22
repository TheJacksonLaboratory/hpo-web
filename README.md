# Human Phenotype Ontology (HPO) Web App

The following guide provides the steps for an out-of-the-box setup for the Human Phenotype Ontology (HPO) Web application with minimum requirements for a local development environment. 
                    
This guide uses the H2 database which is a grails out-of-the-box in-memory or file-base database for quick setup of small-low-volume projects.  
                    

## Requirements For Running

+ Java 1.8
* Git (Latest)

## Requirements For Development

+ AngularCLI (7.*) 
+ Node (11+)
+ Node Package Manager (6.4.1+)

## Setup

+ Clone the repo:

  JAX Bitbucket (Internal)

        git clone https://bitbucket.jax.org/scm/hpo/hpo-web.git
        
  JAX Github 
        
        git clone https://github.com/TheJacksonLaboratory/hpo-web.git
        
+ Change directory to hpo-web

        cd hpo-web

+ Initialize the H2 DB and load the HPO ontology data. Run the following command in the command window inside the hpo-web directory. This step will take approximate 3+ minutes to complete
         
        ./gradlew runCommand -Pargs="load-hpo-db"
        
        E.g. when complete the output in the command window should look like this:
        ...
        finished refreshing database duration: 0:03:49.391 time: Thu Jan 11 11:28:56 EST 2018
         
        BUILD SUCCESSFUL
        
        Note:
        If you desire to re-initialize the application and the database, execute the command again.
        
        ./gradlew runCommand -Pargs="load-hpo-db" ..to initialize and reload the ontology data
        

+ Build the application with a gradle task.

        ./gradlew build -Dgrails.env="test" -DchromeHeadless=true -Dwdm.chromeDriverVersion=2.35
        
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

      ./gradlew clean war -DwarName="hpo-web-someversion.war"
       
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
    
## Other
+ To see possible gradle tasks, execute:
  
      ./gradlew tasks
      
+ To delete the previous build, execute:

      ./gradlew clean
      

+ To build with chrome headless for functional tests, execute:

      ./gradlew clean build -DchromeHeadless=true

+ If you would like to use a local instance of mysql please read conf/application.groovy
l
