function HotelSkeleton() {
  return (
    <div className="hotel-skeleton">
      <div className="skeleton-image"></div>

      <div className="skeleton-content">
        <div className="skeleton-line skeleton-location"></div>
        <div className="skeleton-line skeleton-title"></div>
        <div className="skeleton-line skeleton-description"></div>
        <div className="skeleton-line skeleton-description short"></div>

        <div className="skeleton-footer">
          <div className="skeleton-line skeleton-price"></div>
          <div className="skeleton-line skeleton-button"></div>
        </div>
      </div>
    </div>
  );
}

export default HotelSkeleton;