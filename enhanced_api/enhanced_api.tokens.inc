<?php
use Drupal\Core\Render\BubbleableMetadata;
use Drupal\enhanced_api\Plugin\EnhancedApiRequest;

/*
* implement hook_token_info()
*/
function enhanced_api_token_info(){
  $types['enhanced_api_custom'] = array(
    'name' => t('Enhanced API Custom Token'),
    'description' => t('Custom tokens for enhanced api content.')
  );
  $tokens['api_title'] = array(
    'name' => t('API Content Title'),
    'description' => t('Title, Author Name, etc')
  );
  $tokens['api_cover'] = array(
    'name' => t('API Content Title'),
    'description' => t('Book cover, Author photo, etc')
  );
  $tokens['api_description'] = array(
    'name' => t('API Content Description'),
    'description' => t('About book, Author Spotlight, etc')
  );
  $tokens['api_url'] = array(
    'name' => t('API Content Url'),
    'description' => t('Url of current content')
  );
  $tokens['api_author'] = array(
    'name' => t('API Content Author of Title'),
    'description' => t('Author or contributors of title')
  );
  $tokens['api_location'] = array(
    'name' => t('API Event Location'),
    'description' => t('Location of event')
  );
  $tokens['api_eventDate'] = array(
    'name' => t('API Event Date'),
    'description' => t('Date of event')
  );
  $tokens['api_address'] = array(
    'name' => t('API address of event'),
    'description' => t('Address of event')
  );

  return array(
    'types' => $types,
    'tokens' => array(
      'enhanced_api_custom' => $tokens
    )
  );
}
/*
* implement hook_token()
*/
function enhanced_api_tokens($type, $tokens, array $data, array $options, BubbleableMetadata $bubbleable_metadata){
  $replacements = array();

  if($type == 'enhanced_api_custom') {
    // call enhanced api by current url.
    $data = getContentData();

    foreach ($tokens as $name => $original) {
      switch ($name) {
        case 'api_title':
          $title = $data->title;
          $replacements[$original] = $title;
          break;
        case 'api_cover':
          $cover = $data->cover;
          $replacements[$original] = $cover;
          break;
        case 'api_description':
          $description = $data->description;
          $replacements[$original] = $description;
          break;
        case 'api_url':
          $url = $data->seoFriendlyUrl;
          $replacements[$original] = $url;
          break;
        case 'api_author':
          $author = $data->author;
          $replacements[$original] = $author;
          break;
        case 'api_location':
          $location = $data->location;
          $replacements[$original] = $location;
          break;
        case 'api_eventDate':
          $eventDate = $data->eventDate;
          $replacements[$original] = $eventDate;
          break;
        case 'api_address':
          $address1 = $data->address1;
          $replacements[$original] = $address1;
          break;
      }
    }
  }
  return $replacements;
}

function getCurrentUrl() {
  $query_string = \Drupal::service('path.current')->getPath();
  $query = explode('/', $query_string);
  return $query;
}

function getContentData() {
  $data = (object)[
    'title' => null,
    'cover' => null,
    'description' => null,
    'author' => null,
    'location' => null,
    'eventDate' => null,
    'address1' => null,
  ];

  $currentPath = getCurrentUrl();

  // content for book pages, excerpts, and reading guides
  if (
    $currentPath[1] === 'books' &&
    isset($currentPath[4]) &&
    is_numeric($currentPath[4])
  ) {
    $request = EnhancedApiRequest::factory('titles', $currentPath[4], 'views/product-display', 'enhanced_api_title');
    $titles = $request->execute()->parse([]);
    if (isset($titles) && count($titles) > 0) {
      foreach($titles as $title) {
        $data->title = $title->title;

        if ($title->hasCoverImage === TRUE) {
          $data->cover = $title->cover;
        } else {
          // fallback image...
          $data->cover = $title->cover;
        }

        if (isset($title->aboutTheBook)) {
          $data->description = isset($title->positioning) ? $title->positioning : text_summary($title->aboutTheBook, NULL, 230);
        }

        // for some reasons, og:url won't be rendered without this line. #1444
        $data->seoFriendlyUrl = implode('/', $currentPath);

        if (isset($title->author)) {
          $data->author = $title->author;
        }

        if (isset($title->location)) {
          $data->location = $title->location;
        }

        if (isset($title->startDate)) {
          $data->startDate = $title->startDate;
        }
      }
    }
  }

  // content for author pages and events with author pages
  if (
    $currentPath[1] === 'authors' &&
    isset($currentPath[2]) &&
    is_numeric($currentPath[2])
  ) {
    $request = EnhancedApiRequest::factory('authors', $currentPath[2], 'views/author-display', 'enhanced_api_author');
    $authors = $request->execute()->parse([]);
    if (isset($authors) && count($authors) > 0) {
      foreach($authors as $author) {
        $data->title = $author->display;

        if ($author->hasAuthorPhoto === TRUE) {
          $data->cover = $author->photo;
        } else {
          // fallback image...
          $data->cover = $author->photo;
        }

        if ($author->spotlight) {
          // trim string to 140 or 280 or not...
          $data->description = $author->spotlight;
        }
      }
    }
  }

  // content for event pages
  if (
    $currentPath[1] === 'events' &&
    isset($currentPath[2]) &&
    is_numeric($currentPath[2])
  ) {
    $request = EnhancedApiRequest::factory('events', $currentPath[2], null, 'enhanced_api_event');
    $request->setFilter('zoom', 'https://api.penguinrandomhouse.com/title/authors/definition');
    $events = $request->execute()->parse([]);

    if (isset($events) && count($events) > 0) {
      foreach($events as $event) {
        $data->title = $event->location;
        if (isset($event->authors) && !is_null($event->authors)) {
          $data->title = $event->authors[0]->display . ' at ' . $event->location;
          $data->cover = PRH_AUTHOR_IMAGE_PATH . $event->authors[0]->authorId;
        }

        if (isset($event->description) && !empty($event->description)) {
          $data->description = $event->description;
        } else{
          $data->description = $data->title;
        }

        if ($event->state) {
          $data->author = $event->state;
        }

        if ($event->location) {
          $data->location = $event->location;
        }

        if ($event->eventDate) {
          $data->eventDate = $event->eventDate;
        }

        if ($event->address1) {
          $data->address1 = $event->address1;
        }
      }
    }
  }


  // content for category pages, excerpts by category, reading guides by category
  if (
    $currentPath[1] === 'categories' &&
    isset($currentPath[2]) &&
    is_numeric($currentPath[2]) ||
    $currentPath[1] === 'excerpts' &&
    isset($currentPath[2]) &&
    is_numeric($currentPath[2]) ||
    $currentPath[1] === 'book-club-resources' &&
    isset($currentPath[2]) &&
    is_numeric($currentPath[2])
  ) {
    $request = EnhancedApiRequest::factory('categories', $currentPath[2], null, 'enhanced_api_category');
    $categories = $request->execute()->parse([]);
    if (isset($categories) && count($categories) > 0) {
      foreach($categories as $category) {
        $data->title = $category->description;

      }
    }
  }

  // content for series pages
  if (
    $currentPath[1] === 'series' &&
    isset($currentPath[2]) &&
    strlen($currentPath[2]) == 3
  ) {
    $request = EnhancedApiRequest::factory('series', $currentPath[2], null, 'enhanced_api_series');
    $result = $request->execute();
    $series = $result->response->data->series;
    if (isset($series) && count($series) > 0) {
      foreach($series as $currentSeries) {
        $data->title = $currentSeries->seriesName;

        if (isset($currentSeries->description)) {
          $data->description = $currentSeries->description;
        }
      }
    }
  }

  // content for imprint pages
  if (
    $currentPath[1] === 'imprints' &&
    isset($currentPath[2]) &&
    strlen($currentPath[2]) == 2
  ) {
    $request = EnhancedApiRequest::factory('imprints', $currentPath[2], null, 'enhanced_api_imprint');
    $series = $request->execute()->parse([]);
    if (isset($series) && count($series) > 0) {
      foreach($series as $currentSeries) {
        $data->title = $currentSeries->description;
      }
    }

  }

  return $data;

}
