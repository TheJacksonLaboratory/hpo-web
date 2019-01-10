import io.github.bonigarcia.wdm.WebDriverManager
import org.openqa.selenium.chrome.ChromeDriver
import org.openqa.selenium.chrome.ChromeOptions


def defaultChromeConfig = {
  WebDriverManager.chromedriver().setup()
  ChromeOptions chromeOptions = new ChromeOptions()
  if(System.getProperty('chromeHeadless')){
    chromeOptions.addArguments('--headless')
  }

  ChromeDriver driver = new ChromeDriver(chromeOptions);
  driver.manage().window().size = [1400, 1080]
  driver
}
environments {

  chrome {
    driver = defaultChromeConfig
  }

  chromeHeadless {
    driver = defaultChromeConfig
  }
}

waiting {
  timeout = 5
}
atCheckWaiting = true
cacheDriverPerThread = true

reportsDir = System.getProperty('reportsDir','build/reports/geb')

if(System.getProperty('geb.env')==null){
  driver = defaultChromeConfig
}
