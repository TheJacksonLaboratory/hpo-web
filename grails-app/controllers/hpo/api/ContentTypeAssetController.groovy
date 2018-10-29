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
      }catch(FileNotFoundException e){
        redirect (
          view: '/notFound'
        )
      }
      render(file: file, contentType: contentType)
    }

  @Override
  void setResourceLoader(ResourceLoader resourceLoader) {
    this.resourceLoader = resourceLoader
  }
}
