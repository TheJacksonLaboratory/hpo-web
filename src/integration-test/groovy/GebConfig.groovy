import io.github.bonigarcia.wdm.WebDriverManager
import org.openqa.selenium.chrome.ChromeDriver
import org.openqa.selenium.chrome.ChromeOptions
import org.openqa.selenium.htmlunit.HtmlUnitDriver
import org.openqa.selenium.phantomjs.PhantomJSDriver


def defaultBrowserSize = { driver ->
  driver.manage().window().size = [1400, 1080]
  driver
}

def defaultChromeConfig = {
  WebDriverManager.chromedriver().setup()
  ChromeOptions chromeOptions = new ChromeOptions()
  if(System.getProperty('chromeHeadless')){
    chromeOptions.addArguments('--headless')
    chromeOptions.addArguments('--disable-gpu')
    chromeOptions.addArguments('--no-sandbox')
    chromeOptions.addArguments('--disable-extensions')
    chromeOptions.addArguments('--disable-dev-shm-usage')
    chromeOptions.addArguments('--disable-popup-blocking')
  }
  defaultBrowserSize(new ChromeDriver(chromeOptions))
}
environments {

  htmlUnit {
    driver = { new HtmlUnitDriver() }
  }

  chrome {
    driver = defaultChromeConfig
  }

  chromeHeadless {
    driver = defaultChromeConfig
  }

  phantomJs {
    driver = { new PhantomJSDriver() }
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
