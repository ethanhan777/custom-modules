import { Component, OnInit, Input } from '@angular/core';
import { getCurrentContentInfo } from '../../services/enhanced_api.service';

export const categoryGridSelector = 'category-grid';

@Component({
  selector: categoryGridSelector,
  templateUrl: './category-grid.component.html',
})
export class CategoryGridComponent implements OnInit {
  @Input() data = [];
  categoryData = [
    {
      seoFriendlyUrl: '/2000000169/audiobooks',
      title: 'Audiobooks',
    },
    {
      seoFriendlyUrl: '/2000000021/biography-memoir',
      title: 'Biography & Memoir',
    },
    {
      seoFriendlyUrl: '/2000000025/business',
      title: 'Business',
    },
    {
      seoFriendlyUrl: '/2000000029/childrens',
      title: 'Children\'s Books',
    },
    {
      seoFriendlyUrl: '/2000000181/classics',
      title: 'Classics',
    },
    {
      seoFriendlyUrl: '/2000000036/cooking',
      title: 'Cooking',
    },
    {
      seoFriendlyUrl: '/2000000054/science-fiction-fantasy',
      title: 'Fantasy',
    },
    {
      seoFriendlyUrl: '/2000000057/fiction',
      title: 'Fiction',
    },
    {
      seoFriendlyUrl: '/2000000066/historical-fiction',
      title: 'Historical Fiction',
    },
    {
      seoFriendlyUrl: '/2000000070/history',
      title: 'History',
    },
    {
      seoFriendlyUrl: '/2000000083/literary-fiction',
      title: 'Literary Fiction',
    },
    {
      seoFriendlyUrl: '/2000000106/mystery-suspense',
      title: 'Mystery & Suspense',
    },
    {
      seoFriendlyUrl: '/2000000111/nonfiction',
      title: 'Non-Fiction',
    },
    {
      seoFriendlyUrl: '/2000000123/poetry',
      title: 'Poetry',
    },
    {
      seoFriendlyUrl: '/2000000054/science-fiction-fantasy',
      title: 'Science Fiction',
    },
    {
      seoFriendlyUrl: '/2000000166/teen-young-adult',
      title: 'Teen & Young Adult',
    },
  ];

  isLoaded = false;

  ngOnInit() {
    const currentContentInfo = getCurrentContentInfo();

    if (currentContentInfo.type === 'books') {
      this.data = this.categoryData;
      this.data.map(item => {
        item.seoFriendlyUrl = '/categories' + item.seoFriendlyUrl;
      });
    } else if (currentContentInfo.type === 'excerpts' || currentContentInfo.type === 'book-club-resources') {
      this.data = this.categoryData;
      // do not use /categories for excerpts and reading guides by category pages
      this.data.map(item => {
        item.seoFriendlyUrl = '/' + currentContentInfo.type + item.seoFriendlyUrl;
      });
    }
    this.isLoaded = true;
  }
}
