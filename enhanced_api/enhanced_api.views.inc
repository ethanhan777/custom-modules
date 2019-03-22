<?php

function enhanced_api_views_data() {
  $data = array();

  _enhanced_api_views_series_data($data);
  _enhanced_api_views_series_detail_data($data);
  _enhanced_api_views_title_display_data($data);
  _enhanced_api_views_work_display_data($data);

  return $data;
}

function _enhanced_api_views_series_data(&$data) {
  // Base data
  $data['enhanced_api_series']['table']['group']  = t('Enhanced API: Series List');
  $data['enhanced_api_series']['table']['base'] = array(
    'title' => t('Enhanced API: Series List'),
    'help' => t('Query PRH Enhanced API for Series data.'),
    'query_id' => 'enhanced_api_series'
  );

  // Fields
  $data['enhanced_api_series']['series_code'] = array(
    'title' => t('Series Code'),
    'help' => t('Series Code'),
    'field' => array(
      'id' => 'standard',
    ),
    'filter' => array(
      'id' => 'string'
    ),
    'argument' => array(
      'id' => 'standard',
    )
  );
  $data['enhanced_api_series']['workId'] = array(
    'title' => t('Work ID'),
    'help' => t('Work ID'),
    'filter' => array(
      'id' => 'string'
    ),
  );
  $data['enhanced_api_series']['isbn'] = array(
    'title' => t('ISBN'),
    'help' => t('ISBN'),
    'filter' => array(
      'id' => 'string'
    ),
  );
  $data['enhanced_api_series']['authorId'] = array(
    'title' => t('Author ID'),
    'help' => t('Author ID'),
    'filter' => array(
      'id' => 'string'
    ),
  );
  $data['enhanced_api_series']['divisionCode'] = array(
    'title' => t('Division Code'),
    'help' => t('Division Code'),
    'filter' => array(
      'id' => 'string'
    ),
  );
  $data['enhanced_api_series']['imprintCode'] = array(
    'title' => t('Imprint Code'),
    'help' => t('Imprint Code'),
    'filter' => array(
      'id' => 'string'
    ),
  );
  $data['enhanced_api_series']['catId'] = array(
    'title' => t('Category ID'),
    'help' => t('Category ID'),
    'filter' => array(
      'id' => 'string'
    ),
  );

  $data['enhanced_api_series']['series_name'] = array(
    'title' => t('Series Name'),
    'help' => t('Series Name'),
    'field' => array(
      'id' => 'standard',
    ),
  );

  $data['enhanced_api_series']['description'] = array(
    'title' => t('Description'),
    'help' => t('Description'),
    'field' => array(
      'id' => 'longtext',
    ),
  );

  $data['enhanced_api_series']['series_count'] = array(
    'title' => t('Series Count'),
    'help' => t('Series Count'),
    'field' => array(
      'id' => 'standard',
    ),
  );

  $data['enhanced_api_series']['series_date'] = array(
    'title' => t('Series Date'),
    'help' => t('Series Date'),
    'field' => array(
      'id' => 'date',
    ),
  );

  $data['enhanced_api_series']['is_numbered'] = array(
    'title' => t('Is Numbered'),
    'help' => t('Is Numbered'),
    'field' => array(
      'id' => 'boolean',
    ),
  );

  $data['enhanced_api_series']['is_kids'] = array(
    'title' => t('Is Kids'),
    'help' => t('Is Kids'),
    'field' => array(
      'id' => 'boolean',
    ),
  );

  $data['enhanced_api_series']['seo_friendly_url'] = array(
    'title' => t('Seo Friendly Url'),
    'help' => t('Seo Friendly Url'),
    'field' => array(
      'id' => 'standard',
    ),
  );
}

function _enhanced_api_views_series_detail_data(&$data) {
  // Base data
  $data['enhanced_api_series_detail']['table']['group']  = t('Enhanced API: Series Detail');
  $data['enhanced_api_series_detail']['table']['base'] = array(
    'title' => t('Enhanced API: Series Detail'),
    'help' => t('Query PRH Enhanced API for Series data.'),
    'query_id' => 'enhanced_api_series_detail'
  );

  // Fields
  $data['enhanced_api_series_detail']['series_code'] = array(
    'title' => t('Series Code'),
    'help' => t('Series Code'),
    'argument' => array(
      'id' => 'standard',
    ),
  );

  $data['enhanced_api_series_detail']['isbn'] = array(
    'title' => t('ISBN'),
    'help' => t('ISBN'),
    'field' => array(
      'id' => 'standard',
    ),
  );

  $data['enhanced_api_series_detail']['isbn_hyphenated'] = array(
    'title' => t('ISBN (hyphenated)'),
    'help' => t('ISBN hyphenated'),
    'field' => array(
      'id' => 'standard',
    ),
  );

  $data['enhanced_api_series_detail']['title'] = array(
    'title' => t('Title'),
    'help' => t('Title of the title (book)'),
    'field' => array(
      'id' => 'standard',
    ),
  );

  $data['enhanced_api_series_detail']['subtitle'] = array(
    'title' => t('Subtitle'),
    'help' => t('Subtitle of the title (book)'),
    'field' => array(
      'id' => 'standard',
    ),
  );

  $data['enhanced_api_series_detail']['cover_image'] = array(
    'title' => t('Cover Image'),
    'help' => t('Cover Image.'),
    'field' => array(
      'id' => 'cover_image',
    ),
  );

  $data['enhanced_api_series_detail']['author'] = array(
    'title' => t('Author Name'),
    'help' => t('Author Name.'),
    'field' => array(
      'id' => 'standard',
    ),
  );

  $data['enhanced_api_series_detail']['onsale'] = array(
    'title' => t('On Sale Date'),
    'help' => t('On Sale Date'),
    'field' => array(
      'id' => 'date',
    ),
  );

  $data['enhanced_api_series_detail']['price'] = array(
    'title' => t('Price'),
    'help' => t('Price (CAD)'),
    'field' => array(
      'id' => 'numeric',
    ),
  );

  $data['enhanced_api_series_detail']['seo_friendly_url'] = array(
    'title' => t('SEO Friendly URL'),
    'help' => t('SEO Friendly URL'),
    'field' => array(
      'id' => 'standard',
    ),
  );

  $data['enhanced_api_series_detail']['format_code'] = array(
    'title' => t('Format Code'),
    'help' => t('Format Code'),
    'field' => array(
      'id' => 'standard',
    ),
  );
  $data['enhanced_api_series_detail']['format_description'] = array(
    'title' => t('Format Description'),
    'help' => t('Format Description'),
    'field' => array(
      'id' => 'standard',
    ),
  );
  $data['enhanced_api_series_detail']['division_code'] = array(
    'title' => t('Division Code'),
    'help' => t('Division Code'),
    'field' => array(
      'id' => 'standard',
    ),
  );
  $data['enhanced_api_series_detail']['division_description'] = array(
    'title' => t('Division Description'),
    'help' => t('Division Description'),
    'field' => array(
      'id' => 'standard',
    ),
  );
  $data['enhanced_api_series_detail']['imprint_code'] = array(
    'title' => t('Imprint Code'),
    'help' => t('Imprint Code'),
    'field' => array(
      'id' => 'standard',
    ),
  );
  $data['enhanced_api_series_detail']['imprint_description'] = array(
    'title' => t('Imprint Description'),
    'help' => t('Imprint Description'),
    'field' => array(
      'id' => 'standard',
    ),
  );
  $data['enhanced_api_series_detail']['pages'] = array(
    'title' => t('Pages'),
    'help' => t('Pages'),
    'field' => array(
      'id' => 'standard',
    ),
  );
  $data['enhanced_api_series_detail']['age_code'] = array(
    'title' => t('Age Code'),
    'help' => t('Age Code'),
    'field' => array(
      'id' => 'standard',
    ),
  );
  $data['enhanced_api_series_detail']['age_description'] = array(
    'title' => t('Age Description'),
    'help' => t('Age Description'),
    'field' => array(
      'id' => 'standard',
    ),
  );
  $data['enhanced_api_series_detail']['grade_code'] = array(
    'title' => t('Grade Code'),
    'help' => t('Grade Code'),
    'field' => array(
      'id' => 'standard',
    ),
  );
  $data['enhanced_api_series_detail']['grade_description'] = array(
    'title' => t('Grade Description'),
    'help' => t('Grade Description'),
    'field' => array(
      'id' => 'standard',
    ),
  );

  $data['enhanced_api_series_detail']['subjects'] = array(
    'title' => t('Subjects'),
    'help' => t('Subjects'),
    'field' => array(
      'id' => 'enhanced_api_list',
    ),
  );
  $data['enhanced_api_series_detail']['trim'] = array(
    'title' => t('Trim'),
    'help' => t('Trim'),
    'field' => array(
      'id' => 'standard',
    ),
  );
  $data['enhanced_api_series_detail']['format_family'] = array(
    'title' => t('Format Family'),
    'help' => t('Format Family'),
    'field' => array(
      'id' => 'standard',
    ),
  );
  $data['enhanced_api_series_detail']['consumer_format'] = array(
    'title' => t('Consumer Format'),
    'help' => t('Consumer Format'),
    'field' => array(
      'id' => 'standard',
    ),
  );
  $data['enhanced_api_series_detail']['consumer_imprint'] = array(
    'title' => t('Consumer Imprint'),
    'help' => t('Consumer Imprint'),
    'field' => array(
      'id' => 'standard',
    ),
  );
  $data['enhanced_api_series_detail']['consumer_imprint_uri'] = array(
    'title' => t('Consumer Imprint Uri'),
    'help' => t('SEO Friendly URL'),
    'field' => array(
      'id' => 'standard',
    ),
  );
  $data['enhanced_api_series_detail']['sale_status'] = array(
    'title' => t('Sale Status'),
    'help' => t('Sale Status'),
    'field' => array(
      'id' => 'standard',
    ),
  );
  $data['enhanced_api_series_detail']['language'] = array(
    'title' => t('Language'),
    'help' => t('Language'),
    'field' => array(
      'id' => 'standard',
    ),
  );
  $data['enhanced_api_series_detail']['series_number'] = array(
    'title' => t('Series Number'),
    'help' => t('Series Number'),
    'field' => array(
      'id' => 'standard',
    ),
  );
  $data['enhanced_api_series_detail']['subseries'] = array(
    'title' => t('Subseries'),
    'help' => t('Subseries'),
    'field' => array(
      'id' => 'standard',
    ),
  );
  $data['enhanced_api_series_detail']['edition_type'] = array(
    'title' => t('Edition Type'),
    'help' => t('Edition Type'),
    'field' => array(
      'id' => 'standard',
    ),
  );
  $data['enhanced_api_series_detail']['property_name'] = array(
    'title' => t('Property Name'),
    'help' => t('Property Name'),
    'field' => array(
      'id' => 'standard',
    ),
  );
  $data['enhanced_api_series_detail']['carton_quantity'] = array(
    'title' => t('Carton Quantity'),
    'help' => t('Carton Quantity'),
    'field' => array(
      'id' => 'numeric',
    ),
  );

  $data['enhanced_api_series_detail']['work_id'] = array(
    'title' => t('Work ID'),
    'help' => t('Work ID'),
    'field' => array(
      'id' => 'standard',
    ),
  );
  $data['enhanced_api_series_detail']['frontlistiest_seq'] = array(
    'title' => t('Frontlistiest Seq'),
    'help' => t('Frontlistiest Seq'),
    'field' => array(
      'id' => 'numeric',
    ),
  );
  $data['enhanced_api_series_detail']['sales_restriction_code'] = array(
    'title' => t('Sales Restriction Code'),
    'help' => t('SEO Friendly URL'),
    'field' => array(
      'id' => 'standard',
    ),
  );
  $data['enhanced_api_series_detail']['sales_restriction_description'] = array(
    'title' => t('Sales Restriction Description'),
    'help' => t('Sales Restriction Description'),
    'field' => array(
      'id' => 'standard',
    ),
  );
  $data['enhanced_api_series_detail']['title_short'] = array(
    'title' => t('Title Short'),
    'help' => t('Title Short'),
    'field' => array(
      'id' => 'standard',
    ),
  );

}


function _enhanced_api_views_title_display_data(&$data) {
  // Base data
  $data['enhanced_api_title_display']['table']['group']  = t('Enhanced API: Title Display');
  $data['enhanced_api_title_display']['table']['base'] = array(
    'title' => t('Enhanced API: Title'),
    'help' => t('Query PRH Enhanced API for Title data.'),
    'query_id' => 'enhanced_api_title'
  );

  // Fields
  $data['enhanced_api_title_display']['work_id'] = array(
    'title' => t('Work ID'),
    'help' => t('Work ID of the title (book)'),
    'field' => array(
      'id' => 'standard',
    ),
  );

  $data['enhanced_api_title_display']['isbn'] = array(
    'title' => t('ISBN'),
    'help' => t('ISBN'),
    'field' => array(
      'id' => 'standard',
    ),
    'argument' => [
      'id' => 'standard'
    ],
  );

  $data['enhanced_api_title_display']['isbn_hyphenated'] = array(
    'title' => t('ISBN (hyphenated)'),
    'help' => t('ISBN hyphenated'),
    'field' => array(
      'id' => 'standard',
    ),
  );

  $data['enhanced_api_title_display']['title'] = array(
    'title' => t('Title'),
    'help' => t('Title of the title (book)'),
    'field' => array(
      'id' => 'standard',
    ),
  );

  $data['enhanced_api_title_display']['subtitle'] = array(
    'title' => t('Subtitle'),
    'help' => t('Subtitle of the title (book)'),
    'field' => array(
      'id' => 'standard',
    ),
  );

  $data['enhanced_api_title_display']['imprint_code'] = array(
    'title' => t('Imprint Code'),
    'help' => t('Imprint code of the title (book)'),
    'field' => array(
      'id' => 'standard',
    ),
  );

  $data['enhanced_api_title_display']['imprint_description'] = array(
    'title' => t('Imprint Description'),
    'help' => t('Imprint description of the title (book)'),
    'field' => array(
      'id' => 'standard',
    ),
  );

  $data['enhanced_api_title_display']['on_sale_date'] = array(
    'title' => t('On Sale'),
    'help' => t('On Sale date'),
    'field' => array(
      'id' => 'date',
    ),
  );

  $data['enhanced_api_title_display']['total_pages'] = array(
    'title' => t('Pages'),
    'help' => t('Number of pages in the title (book)'),
    'field' => array(
      'id' => 'numeric',
    ),
  );

  $data['enhanced_api_title_display']['trim_size'] = array(
    'title' => t('Trim'),
    'help' => t('Trim'),
    'field' => array(
      'id' => 'standard',
    ),
  );

  $data['enhanced_api_title_display']['age_code'] = array(
    'title' => t('Age Code'),
    'help' => t('Age code of the title (book)'),
    'field' => array(
      'id' => 'standard',
    ),
  );

  $data['enhanced_api_title_display']['age_description'] = array(
    'title' => t('Age Description'),
    'help' => t('Age description of the title (book)'),
    'field' => array(
      'id' => 'standard',
    ),
  );

  $data['enhanced_api_title_display']['can_price'] = array(
    'title' => t('Price'),
    'help' => t('Price of the title (book)'),
    'field' => array(
      'id' => 'numeric',
      'float' => TRUE,
    ),
  );

  $data['enhanced_api_title_display']['format_code'] = array(
    'title' => t('Format Code'),
    'help' => t('Format code of the title (book)'),
    'field' => array(
      'id' => 'standard',
    ),
  );

  $data['enhanced_api_title_display']['format_description'] = array(
    'title' => t('Format Description'),
    'help' => t('Format description of the title (book)'),
    'field' => array(
      'id' => 'standard',
    ),
  );

  $data['enhanced_api_title_display']['has_insight'] = array(
    'title' => t('Insight Flag'),
    'help' => t('Indication of insight availabillity.'),
    'field' => array(
      'id' => 'boolean',
    ),
  );

  $data['enhanced_api_title_display']['has_excerpt'] = array(
    'title' => t('Excerpt Flag'),
    'help' => t('Indication of excerpt availabillity.'),
    'field' => array(
      'id' => 'boolean',
    ),
  );

  $data['enhanced_api_title_display']['text_excerpt'] = array(
    'title' => t('Excerpt'),
    'help' => t('Excerpt.'),
    'field' => array(
      'id' => 'longtext',
    ),
  );

  $data['enhanced_api_title_display']['text_excerpt_copyright'] = array(
    'title' => t('Excerpt copyright'),
    'help' => t('Excerpt copyright.'),
    'field' => array(
      'id' => 'longtext',
    ),
  );

  $data['enhanced_api_title_display']['kenote'] = array(
    'title' => t('Keynote'),
    'help' => t('Keynote.'),
    'field' => array(
      'id' => 'longtext',
    ),
  );

  $data['enhanced_api_title_display']['positioning'] = array(
    'title' => t('positioning'),
    'help' => t('positioning.'),
    'field' => array(
      'id' => 'longtext',
    ),
  );

  $data['enhanced_api_title_display']['seo_friendly_url'] = array(
    'title' => t('URL'),
    'help' => t('SEO friendly URL path'),
    'field' => array(
      'id' => 'standard',
    ),
  );

  $data['enhanced_api_title_display']['division_code'] = array(
    'title' => t('Division Code'),
    'help' => t('Division code of the title (book)'),
    'field' => array(
      'id' => 'standard',
    ),
  );

  $data['enhanced_api_title_display']['division_description'] = array(
    'title' => t('Division Description'),
    'help' => t('Division description of the title (book)'),
    'field' => array(
      'id' => 'standard',
    ),
  );

  $data['enhanced_api_title_display']['grade_code'] = array(
    'title' => t('Grade Code'),
    'help' => t('Grade code of the title (book)'),
    'field' => array(
      'id' => 'standard',
    ),
  );

  $data['enhanced_api_title_display']['grade_description'] = array(
    'title' => t('Grade Description'),
    'help' => t('Grade description of the title (book)'),
    'field' => array(
      'id' => 'standard',
    ),
  );

  $data['enhanced_api_title_display']['subjects_code'] = array(
    'title' => t('Subjects Code'),
    'help' => t('Subjects code of the title (book)'),
    'field' => array(
      'id' => 'standard',
    ),
  );

  $data['enhanced_api_title_display']['subjects_description'] = array(
    'title' => t('Subjects Description'),
    'help' => t('Subjects description of the title (book)'),
    'field' => array(
      'id' => 'standard',
    ),
  );

  $data['enhanced_api_title_display']['about_the_book'] = array(
    'title' => t('About the book'),
    'help' => t('About the book.'),
    'field' => array(
      'id' => 'longtext',
    ),
  );

  $data['enhanced_api_title_display']['has_cover_image'] = array(
    'title' => t('Cover Image flag'),
    'help' => t('Indication of Cover image availabillity.'),
    'field' => array(
      'id' => 'boolean',
    ),
  );

  $data['enhanced_api_title_display']['sales_restriction_code'] = array(
    'title' => t('Sales Restriction Code'),
    'help' => t('Subjects code of the title (book)'),
    'field' => array(
      'id' => 'standard',
    ),
  );

  $data['enhanced_api_title_display']['sales_restriction_description'] = array(
    'title' => t('Sales Restriction Description'),
    'help' => t('Sales Restriction description of the title (book)'),
    'field' => array(
      'id' => 'standard',
    ),
  );

  $data['enhanced_api_title_display']['has_cover_image'] = array(
    'title' => t('Cover Image flag'),
    'help' => t('Indication of Cover image availabillity.'),
    'field' => array(
      'id' => 'boolean',
    ),
  );

  $data['enhanced_api_title_display']['cover_image'] = array(
    'title' => t('Book Cover'),
    'help' => t('Book Cover Image'),
    'field' => array(
      'id' => 'cover_image',
    ),
  );

  $data['enhanced_api_title_display']['carton_quantity'] = array(
    'title' => t('Carton quantity'),
    'help' => t('Carton quantity'),
    'field' => array(
      'id' => 'numeric',
    ),
  );

  $data['enhanced_api_title_display']['has_bestseller'] = array(
    'title' => t('Bestseller flag'),
    'help' => t('Indication of Bestseller availabillity.'),
    'field' => array(
      'id' => 'boolean',
    ),
  );

  $data['enhanced_api_title_display']['praise'] = array(
    'title' => t('Praise'),
    'help' => t('Praise.'),
    'field' => array(
      'id' => 'longtext',
    ),
  );

  // $data['enhanced_api_title_display']['book_awards_winner'] = array(
  //   'title' => t('Book awards winner'),
  //   'help' => t('Book awards winner.'),
  //   'field' => array(
  //     'id' => 'standard',
  //   ),
  // );

  // $data['enhanced_api_title_display']['book_awards_longlist'] = array(
  //   'title' => t('Book awards longlist'),
  //   'help' => t('Book awards longlist.'),
  //   'field' => array(
  //     'id' => 'standard',
  //   ),
  // );

  $data['enhanced_api_title_display']['reading_guide'] = array(
    'title' => t('Reading guide'),
    'help' => t('Reading guide.'),
    'field' => array(
      'id' => 'longtext',
    ),
  );

  $data['enhanced_api_title_display']['series_code'] = array(
    'title' => t('Series code'),
    'help' => t('Series code.'),
    'field' => array(
      'id' => 'standard',
    ),
  );

  $data['enhanced_api_title_display']['series_title'] = array(
    'title' => t('Series title'),
    'help' => t('Series title.'),
    'field' => array(
      'id' => 'standard',
    ),
  );

  $data['enhanced_api_title_display']['series_description'] = array(
    'title' => t('Series description'),
    'help' => t('Series description.'),
    'field' => array(
      'id' => 'longtext',
    ),
  );

  $data['enhanced_api_title_display']['series_edit_vol_no'] = array(
    'title' => t('Series Edit Vol No'),
    'help' => t('Series Edit Vol No.'),
    'field' => array(
      'id' => 'numeric',
    ),
  );

  $data['enhanced_api_title_display']['series_count'] = array(
    'title' => t('Series count'),
    'help' => t('Series count.'),
    'field' => array(
      'id' => 'numeric',
    ),
  );

  $data['enhanced_api_title_display']['award_winners'] = array(
    'title' => t('Award winners'),
    'help' => t('Award winners.'),
    'field' => array(
      'id' => 'standard',
    ),
  );

  $data['enhanced_api_title_display']['award_longlists'] = array(
    'title' => t('Award longlists'),
    'help' => t('Award longlists.'),
    'field' => array(
      'id' => 'standard',
    ),
  );

  $data['enhanced_api_title_display']['author_id'] = array(
    'title' => t('Author ID'),
    'help' => t('Author ID.'),
    'field' => array(
      'id' => 'standard',
    ),
  );

  $data['enhanced_api_title_display']['author_name'] = array(
    'title' => t('Author name text'),
    'help' => t('Author name text.'),
    'field' => array(
      'id' => 'standard',
    ),
  );

  $data['enhanced_api_title_display']['author_url'] = array(
    'title' => t('Author link'),
    'help' => t('Author link.'),
    'field' => array(
      'id' => 'standard',
    ),
  );

  $data['enhanced_api_title_display']['categories'] = array(
    'title' => t('Categories'),
    'help' => t('Categories.'),
    'field' => array(
      'id' => 'enhanced_api_categories',
    ),
  );
}

function _enhanced_api_views_work_display_data(&$data) {
  // Base data
  $data['enhanced_api_work_display']['table']['group']  = t('Enhanced API: Work Display');
  $data['enhanced_api_work_display']['table']['base'] = array(
    'field' => 'works',
    'title' => t('Enhanced API: Work Display'),
    'help' => t('Query PRH Enhanced API for Work data.'),
    'query_id' => 'enhanced_api_work_display'
  );

  // Fields
  $data['enhanced_api_work_display']['work_id'] = array(
    'title' => t('Work ID'),
    'help' => t('Work ID'),
    'field' => array(
      'id' => 'standard',
    ),
    'argument' => array (
      'id' => 'standard',
    ),
  );
  $data['enhanced_api_work_display']['title'] = array(
    'title' => t('Title'),
    'help' => t('Work Title'),
    'field' => array(
      'id' => 'standard',
    ),
  );
  $data['enhanced_api_work_display']['seo_friendly_url'] = array(
    'title' => t('URL'),
    'help' => t('SEO friendly URL path'),
    'field' => array(
      'id' => 'standard',
    ),
  );


}
