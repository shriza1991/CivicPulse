"""add missing issue and cluster columns

Revision ID: a89c2f1e4d3b
Revises: f0ea6a746f49
Create Date: 2026-08-23 17:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a89c2f1e4d3b'
down_revision: Union[str, Sequence[str], None] = 'f0ea6a746f49'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add missing columns to issues table
    op.add_column('issues', sa.Column('audio_url', sa.String(), nullable=True))
    op.add_column('issues', sa.Column('country_code', sa.String(), nullable=False, server_default='IND'))
    op.create_index(op.f('ix_issues_country_code'), 'issues', ['country_code'], unique=False)
    op.add_column('issues', sa.Column('ward_id', sa.String(), nullable=True))
    op.create_index(op.f('ix_issues_ward_id'), 'issues', ['ward_id'], unique=False)

    # Add missing columns to clusters table
    op.add_column('clusters', sa.Column('category', sa.String(), nullable=False, server_default='general'))
    op.create_index(op.f('ix_clusters_category'), 'clusters', ['category'], unique=False)
    op.add_column('clusters', sa.Column('country_code', sa.String(), nullable=False, server_default='IND'))
    op.create_index(op.f('ix_clusters_country_code'), 'clusters', ['country_code'], unique=False)
    op.add_column('clusters', sa.Column('demographic_impact_score', sa.Float(), nullable=False, server_default='0.0'))
    op.add_column('clusters', sa.Column('priority_score', sa.Float(), nullable=False, server_default='0.0'))
    op.add_column('clusters', sa.Column('status', sa.String(), nullable=False, server_default='active'))
    op.create_index(op.f('ix_clusters_status'), 'clusters', ['status'], unique=False)
    op.add_column('clusters', sa.Column('summary', sa.String(), nullable=True))


def downgrade() -> None:
    # Drop columns from clusters table
    op.drop_index(op.f('ix_clusters_status'), table_name='clusters')
    op.drop_column('clusters', 'summary')
    op.drop_column('clusters', 'status')
    op.drop_column('clusters', 'priority_score')
    op.drop_column('clusters', 'demographic_impact_score')
    op.drop_index(op.f('ix_clusters_country_code'), table_name='clusters')
    op.drop_column('clusters', 'country_code')
    op.drop_index(op.f('ix_clusters_category'), table_name='clusters')
    op.drop_column('clusters', 'category')

    # Drop columns from issues table
    op.drop_index(op.f('ix_issues_ward_id'), table_name='issues')
    op.drop_column('issues', 'ward_id')
    op.drop_index(op.f('ix_issues_country_code'), table_name='issues')
    op.drop_column('issues', 'country_code')
    op.drop_column('issues', 'audio_url')
