# Sinpet patch plan

# 목적
 - Google Search console에서 아래와 같은 Issue를 해결하기 위한 계획.
 - Google 검색엔진의 허용 범위 내에서, 최대한 정확한 정보를 제공하기 위한 계획.
 - 검색 결과 노출을 최대한 높이면서, Google의 데이터 정책을 위반하지 않아야 함. (가짜 리뷰 생성 등)

## 1. 제품 스니펫
1) 'offers', 'review' 또는 'aggregateRating'을(를) 지정해야 합니다.
 - https://kspiritsclub.com/en/spirits/fsk-2020000420482
 - https://kspiritsclub.com/en/spirits/fsk-2020000420493

2) ‘review’ 입력란이 누락되었습니다.
 - https://kspiritsclub.com/ko/spirits/mfds-202500853217
 - https://kspiritsclub.com/en/spirits/mfds-202500672660
3) 속성 'reviewCount'의 값은 양수여야 합니다.(경로: 'aggregateRating')
 - 공통적으로 발생하는 Issue
4) 속성 'ratingCount'의 값은 양수여야 합니다.(경로: 'aggregateRating')
 - 공통적으로 발생하는 Issue
5) 평점 값이 범위를 벗어났습니다.(경로: 'aggregateRating')
 - 공통적으로 발생하는 Issue

## 2. 판매자 목록
1) ‘shippingRate’ 입력란의 값이 잘못되었습니다.(경로: 'offers.shippingDetails')
 - 공통적으로 발생하는 Issue
2) 속성 'reviewCount'의 값은 양수여야 합니다.(경로: 'aggregateRating')
 - 공통적으로 발생하는 Issue
3) 속성 'ratingCount'의 값은 양수여야 합니다.(경로: 'aggregateRating')	
 - 공통적으로 발생하는 Issue
4) 평점 값이 범위를 벗어났습니다.(경로: 'aggregateRating')
 - 공통적으로 발생하는 Issue

## 3. 리뷰 스니펫
1) 평점 값이 범위를 벗어났습니다.	
 - 공통적으로 발생하는 Issue
2) 속성 'reviewCount'의 값은 양수여야 합니다.	
 - 공통적으로 발생하는 Issue
3) 속성 'ratingCount'의 값은 양수여야 합니다.
 - 공통적으로 발생하는 Issue

 ## 4. 참조할 사이트맵 주소
 - https://kspiritsclub.com/sitemap.xml