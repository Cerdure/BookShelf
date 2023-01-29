package com.cerdure.bookshelf.domain.shelf;

import com.cerdure.bookshelf.domain.book.Book;
import com.cerdure.bookshelf.domain.member.Member;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity @Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ReadingBook {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "reading_book_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id")
    private Book book;

    @Builder
    public ReadingBook(Long id, Member member, Book book) {
        this.id = id;
        this.member = member;
        this.book = book;
    }
}
