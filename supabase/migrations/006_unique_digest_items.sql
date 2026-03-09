ALTER TABLE digest_items
  ADD CONSTRAINT uq_digest_subscriber_opportunity
  UNIQUE (subscriber_id, opportunity_id);
