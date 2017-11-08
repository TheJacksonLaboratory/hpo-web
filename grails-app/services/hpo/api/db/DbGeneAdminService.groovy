package hpo.api.db

import com.github.phenomics.ontolib.formats.hpo.HpoGeneAnnotation
import com.github.phenomics.ontolib.formats.hpo.HpoOntology
import grails.gorm.transactions.Transactional
import hpo.api.io.HpoGeneTransitiveAnnotationParser
import hpo.api.term.DbTerm
import org.apache.commons.lang.time.StopWatch
import hpo.api.gene.DbGene
import org.grails.io.support.ClassPathResource

@Transactional
class DbGeneAdminService {
  HpoOntology hpoOntology
  def sessionFactory
  void deleteDbGenes() {
    StopWatch stopWatch = new StopWatch()
    stopWatch.start()
    DbGene.executeUpdate("delete from DbGene")
    DbGene.executeUpdate("delete from DbGene")
    println("duration: ${stopWatch} time: ${new Date()}")
  }

  void refreshGenes() {
    deleteDbGenes()
    Map relationship = [:]
    List<HpoGeneAnnotation> geneAnnotations = getAnnotations()
    Map<Integer, String> uniqueGenes = getUniqueGenes(geneAnnotations)
    uniqueGenes.each { key, value ->
      DbGene dbGene = new DbGene(key, value)
      dbGene.save()
    }
  }
  void loadDB(){
    List<HpoGeneAnnotation> geneAnnotations =[]
    File file = new ClassPathResource("ALL_SOURCES_ALL_FREQUENCIES_phenotype_to_genes.txt").file
    HpoGeneTransitiveAnnotationParser geneTransitiveParser = new HpoGeneTransitiveAnnotationParser(file)
    Map<String, DbTerm> termMemoryMap = [:]
    Map<Integer, DbGene> geneMemoryMap = [:]
    Integer counter = 0
    DbGene dbGene = null
    DbTerm term = null
    while (geneTransitiveParser.hasNext()) {
      HpoGeneAnnotation geneAnnotation = geneTransitiveParser.next()
      dbGene = geneMemoryMap.get(geneAnnotation.entrezGeneId)
      if(!dbGene) {
        dbGene = new DbGene(geneAnnotation.entrezGeneId, geneAnnotation.entrezGeneSymbol)
        geneMemoryMap.put(geneAnnotation.entrezGeneId,dbGene)
        dbGene.save()
      }
      term = termMemoryMap.get(geneAnnotation.getTermId().getIdWithPrefix())
      if(!term){
        term = DbTerm.findByOntologyId(geneAnnotation.getTermId().getIdWithPrefix())
        termMemoryMap.put(geneAnnotation.getTermId().getIdWithPrefix(),term)
      }
      if(term){
        term.addToDbGene(dbGene)
      }else{
        // THESE ARE TERMS NOT FOUND IN DB_TERM BUT IN PHENOTYPE FILE
        counter++
      }
    }
    System.out.println(counter.toString())
  }

  static List<HpoGeneAnnotation> getAnnotations(){
    List<HpoGeneAnnotation> geneAnnotations =[]
    File file = new ClassPathResource("test-p_g.txt").file
    HpoGeneTransitiveAnnotationParser geneTransitiveParser = new HpoGeneTransitiveAnnotationParser(file)
    while (geneTransitiveParser.hasNext()) {
      HpoGeneAnnotation geneAnnotation = geneTransitiveParser.next()
      geneAnnotations.add(geneAnnotation)
    }
    return geneAnnotations
  }
  static Map<Integer, String> getUniqueGenes(List<HpoGeneAnnotation> geneAnnotations){
    Map<Integer, String> geneIdToSymbol = [:]
    geneAnnotations.each{
      geneIdToSymbol.put(it.getEntrezGeneId(),it.getEntrezGeneSymbol())
    }
    return geneIdToSymbol
  }
}


