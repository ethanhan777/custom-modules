<?php

namespace Drupal\enhanced_api\Plugin;

use Drupal\enhanced_api\Plugin\EnhancedApiRequest;
/**
 * Title-specific request handler
 */
class EnhancedApiRequestTitleViews extends EnhancedApiRequest {
  function __construct($base_field, $id, $method) {
    parent::__construct($base_field, $id, $method);

    if (isset($method) && $method == 'views/product-display') {
      $this->params['catSetId'] = 'CN';
    }
  }

  function parse($joins) {
    $results = array();
    $title_parsed = new \stdClass();
    $titles = array();
    switch ($this->method) {
      case 'views/list-display':
        $titles = $this->response->data->titles;
        break;

      case 'views/product-display':
        $titles[] = $this->response->data;
        break;

      case 'views/also-purchased':
        $titles[] = $this->response->data->works;
        return $titles;
        break;
    }
    // return $titles;

    foreach ($titles as $title) {
      // praise
      if (isset($title->praises)) {
        foreach ($title->praises as $isbn => $praise) {
          if ($isbn == $this->id) {
            $title->praise = $praise;
            unset($title->praises);
          }
        }
      }

      // awards
      if (isset($title->bookAwards)) {
        foreach ($title->bookAwards as $type => $awards) {
          foreach ($awards as $award) {
            if ($award->ean == $this->id) {
              if ($type == 'longlist') {
                $title->awards->longlists[] = $award;
              }
              if ($type == 'winner') {
                $title->awards->winners[] = $award;
              }
              unset($title->bookAwards);
            }
          }
        }
      }

      // current title details
      foreach ($title->formats as $format => $isbns) {
        foreach ($isbns as $isbn => $details) {
          if ($isbn == $this->id) {
            // Cover image
            $details->cover = $this->get_image($details->isbn);

            // onSaleDate timestamp
            if (isset($details->onSaleDate)) {
              $details->onSaleTimestamp = strtotime($details->onSaleDate->date . ' ' . $details->onSaleDate->timezone);
            }

            // authors
            if (isset($details->contributors)) {
              $authors = array();
              foreach ($details->contributors as $contributor) {
                if ($contributor->roleCode == 'A') {
                  $authors[] = $contributor->display;
                }
              }

              // one author
              if (count($authors) < 2) {
                $title->author = implode('', $authors);
              }

              // two authors
              elseif (count($authors) == 2) {
                $title->author = implode(' and ', $authors);
              }

              // more than two authors
              else {
                foreach($authors as $key => $author) {
                  if ($key == 0) {
                    $title->author = $author;
                  }
                  else if ($key > 0 && $key < count($authors) - 1) {
                    $title->author .= ', ' . $author;
                  }
                  else if ($key == count($authors) - 1) {
                    $title->author .= ' and ' . $author;
                  }
                  else {
                    $title->author .= $author;
                  }
                }
              }
            }
            $title = (object) array_merge((array) $title, (array) $details);

            // parse other titles
            forEach($title->formats as $key => $formats) {
              forEach($formats as $format) {
                // cover image
                $format->cover = $this->get_image($format->isbn);
                // contributors
                $formatContributors = $format->contributors;
                unset($format->contributors);
                $format->contributors = array();
                foreach ($formatContributors as $formatContributor) {
                  $format->contributors[] = $formatContributor;
                }

                $title->otherFormats[] = $format;
              }
            }

            // remove other titles
            unset($title->formats);
          }
        }
      }

      // contributors
      $contributors = $title->contributors;
      unset($title->contributors);
      $title->contributors = array();
      foreach ($contributors as $contributor) {
        $title->contributors[] = $contributor;
      }

      $results[] = $title;
    }

    return $results;
  }
}
