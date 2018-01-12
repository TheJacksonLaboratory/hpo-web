package hpo.api.io;

import com.github.phenomics.ontolib.formats.hpo.HpoDiseaseAnnotation;
import com.github.phenomics.ontolib.io.obo.hpo.HpoDiseaseAnnotationParser;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;

import com.github.phenomics.ontolib.io.base.TermAnnotationParserException;
import com.github.phenomics.ontolib.ontology.data.ImmutableTermId;
import com.google.common.base.Enums;
import com.google.common.collect.ImmutableList;

public class HpoDiseaseParser {

  private String nextLine;
  private BufferedReader reader;
  private final File file;


  public HpoDiseaseParser(File file) throws IOException, TermAnnotationParserException{
    this.file = file;
    this.reader = new BufferedReader(new FileReader(file));
    this.nextLine = reader.readLine();
    checkFirstLine();
  };
  private void checkFirstLine() throws TermAnnotationParserException {
    final String[] arr = nextLine.split("\t");
    if (arr.length != 14) {
      throw new TermAnnotationParserException(
        "Does not look like HPO disease annotation file. Invalid number of fields in first "
          + "line, expected 14, was " + arr.length);
    }
    if (!Enums.getIfPresent(HpoDiseaseAnnotation.DatabaseSource.class, arr[0]).isPresent()) {
      throw new TermAnnotationParserException(
        "Does not look like HPO disease annotation file. First field value was " + arr[0]
          + " but was expected to be one of "
          + Arrays.toString(HpoDiseaseAnnotation.DatabaseSource.values()));
    }
  }


  public boolean hasNext() {
    return nextLine != null;
  }

  public HpoDiseaseAnnotation next() throws TermAnnotationParserException, IOException {
    final String[] arr = nextLine.split("\t");
    if (arr.length != 14) {
      throw new TermAnnotationParserException(
        "Does not look like HPO disease annotation file. Invalid number of fields, expected "
          + "14 but was " + arr.length);
    }

    final String db = arr[0];
    final String dbObjectId = arr[1];
    final String dbName = arr[2].split(";")[0];
    final String qualifier = arr[3];
    final ImmutableTermId hpoId = ImmutableTermId.constructWithPrefix(arr[4]);
    final String dbReference = arr[5];
    final String evidenceCode = arr[6];
    final String onsetModifier = arr[7];
    final String frequencyModifier = arr[8];
    final String with = arr[9];
    final String aspect = arr[10];
    final String synonym = arr[11];
    final String dateStr = arr[12];
    final String assignedBy = arr[13];

    nextLine = reader.readLine();

    final ImmutableList<String> formatStrings = ImmutableList.of("yyyy.MM.dd", "yyyy-MM-dd");
    Date date = null;
    for (String formatString : formatStrings) {
      final SimpleDateFormat format = new SimpleDateFormat(formatString);
      try {
        date = format.parse(dateStr);
        break;
      } catch (ParseException e) {
        continue; // swallow
      }
    }
    if (date == null) {
      throw new TermAnnotationParserException(
        "There was a problem parsing the date value " + dateStr);
    }

    return new HpoDiseaseAnnotation(db, dbObjectId, dbName, qualifier, hpoId, dbReference,
      evidenceCode, onsetModifier, frequencyModifier, with, aspect, synonym, date, assignedBy);
  }

  public void close() throws IOException {
    reader.close();
  }

  public File getFile() {
    return file;
  }



}
