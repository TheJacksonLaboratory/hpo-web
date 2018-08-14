package hpo.api.disease

import hpo.api.gene.DbGene
import hpo.api.term.DbTerm
import org.apache.commons.lang.NullArgumentException
import org.monarchinitiative.phenol.formats.hpo.HpoDisease
import org.apache.commons.lang.WordUtils

class DbDisease {

  String db
  String dbId
  String diseaseName
  String diseaseId

  static constraints = {
    db()
    dbId()
    diseaseName()
    diseaseId(unique: true)
  }
  static mapping = {
    diseaseName(type: 'text')
    version false
  }
  Set<DbTerm> dbTerms = [] as Set<DbTerm>
  Set<DbGene> dbGenes = [] as Set<DbGene>
  static hasMany = [dbTerms: DbTerm, dbGenes: DbGene]
  static belongsTo = [DbTerm, DbGene]

  DbDisease() {}

  DbDisease(HpoDisease disease) {
    db = disease.getDiseaseDatabaseId().getPrefix().getValue().toString()
    dbId = disease.getDiseaseDatabaseId().getId()
    diseaseName = WordUtils.capitalizeFully(
      disease.getName().replaceAll('^\\%\\d{6}|^\\#\\d{6}|^\\d{6}', '').trim()
        .split(';')[0]
    )
    diseaseId = disease.getDiseaseDatabaseId().getIdWithPrefix();
  }


  static String fixDiseaseName(String dbId, String name){
    if(name == null || name == ''){
      throw new NullArgumentException("Disease Name for disease ${dbId}")
    }
    return name.replaceAll('^\\%\\d{6}|^\\#\\d{6}|^\\d{6}|^\\+\\d{6}', '').trim().split(';')[0]
  }

}

