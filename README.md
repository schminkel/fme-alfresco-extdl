Datalist Extensions for Alfresco Share (for Alfresco 4.2.x)
===========================================================

This project is the Alfresco 4.2.x port of fme's datalist extensions.

The initial documentation remains at [google](http://code.google.com/p/fme-alfresco-extensions/wiki/DatalistExtension).

The Project is in development right now (2015-02-12) in oder to get it working with Alfresco Enterprise 4.2.3.

Installation
============

* Run `mvn package`
* Put `./fme-alfresco-extdl-share/target/fme-alfresco-extdl-share-1.3.jar` in `tomcat/shared/lib` or `tomcat/webapps/share/WEB-INF/lib`
* Put `./fme-alfresco-extdl-repo/target/fme-alfresco-extdl-repo-1.3.jar` in `tomcat/webapps/alfresco/WEB-INF/lib`

Customization Example
=====================
See repo custom context for an approach:
https://github.com/tass01024/fme-alfresco-extdl/blob/master/fme-alfresco-extdl-repo/example/my-custom-datalists-context.xml


OPEN ISSUES
===========
- Clear form button does not work after opening the edit element dialog any more.
- Filter on the left hand side (e.g. kürzlich hinzugefügt) does not work correct, maybe some date range issue!?
- Form-Filter does not work correct with list "Aufgabeliste (Erweitert)" when nothing was filled out,
  just clicking the button leads to empty results and should show all elements.

- Display of Versions seems not to work right now!

- Form-Filter for persons needs to be checked. seams not to work correctly.
- Datalist model needs to be compared with the 4.2.3 initial model (duplication)

- Correct pom information, developer, github etc.

Nice to have:
- Comment field does not render a tiny-mce textarea, fix this. This was reported as not working before forking the project.