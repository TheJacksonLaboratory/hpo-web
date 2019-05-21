package hpo.api

import org.springframework.core.io.ResourceLoader
import org.springframework.context.ResourceLoaderAware

class ContentTypeAssetController implements ResourceLoaderAware {
   ResourceLoader resourceLoader

    def setCharEncoding(String contentType) {
      File file;
      String requestURI = request.getProperty('requestURI')
      try{
        file  = resourceLoader.getResource(requestURI).getFile()
        render(file: file, contentType: contentType)
      }catch(FileNotFoundException e){
        redirect (
          view: '/notFound'
        )
      }
    }

  @Override
  void setResourceLoader(ResourceLoader resourceLoader) {
    this.resourceLoader = resourceLoader
  }
}
