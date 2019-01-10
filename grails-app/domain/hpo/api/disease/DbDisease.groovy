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
    db = disease.getDiseaseDatabaseId().getPrefix()
    dbId = disease.getDiseaseDatabaseId().getId()
    diseaseName = fixDiseaseName(disease.getDiseaseDatabaseId().getId(), disease.getName())
    diseaseId = disease.getDiseaseDatabaseId().toString();
  }


  /*
    Method to fix OMIM & ORPHA identifiers out of phenotype.hpoa
    many come with rough prefixes.

    #123456
    %123456

    as well as the disease names coming with synonyms after a semi-colon. Until we have
    a steady source of disease names and id's we will need this method.
   */
  static String fixDiseaseName(String dbId, String name){
    if(name == null || name == ''){
      throw new NullArgumentException("Disease Name for disease ${dbId}")
    }

    return WordUtils.capitalizeFully(
      name.replaceAll(/^%\d{6}|^#\d{6}|^\d{6}|^\+\d{6}/, '').trim().split(';')[0])
  }

}

